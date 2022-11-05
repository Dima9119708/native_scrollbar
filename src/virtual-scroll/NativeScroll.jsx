import React, {useEffect, useRef} from 'react';

const handleMovementWheel = (
    current,
    event,
) => {
    if (event.deltaY > 0) {
        current.content.positionY -= 60
    } else {
        current.content.positionY += 60
    }
}

const handleBoundWheel = (
    current,
) => {
    const { content } = current

    if (content.positionY > 0) {
        content.positionY = 0
    }

    if ((current.viewHeight - content.positionY) > current.fullHeight) {
        content.positionY = current.viewHeight - current.fullHeight
    }
}

const handleMovementMouse = (
    control,
    pointerMoveY,
    pointerStartY,
) => {
    control.scrollbarTrack.positionYMove = ((pointerMoveY.pageY - pointerStartY.pageY) + control.scrollbarTrack.positionYEnd)
}

const handleBoundMouse = (
    control,
) => {
    const { height } = control.scrollbar
    const { height: trackHeight } = control.scrollbarTrack
    const { scrollbarTrack } = control

    if ((scrollbarTrack.positionYMove + trackHeight) > height) {
        scrollbarTrack.positionYMove = height - trackHeight
    }

    if (scrollbarTrack.positionYMove < 0) {
        scrollbarTrack.positionYMove = 0
    }
}

const calcHeightScrollbarTrack = (control) => {
    const { fullHeight, viewHeight } = control
    const { height } = control.scrollbar

    let percent =  ((viewHeight * 100) / fullHeight)

    if (percent < 5) {
        percent = 5
    }

    return percent * height / 100
}

const calcScrolledScrollbarTrack = (control) => {
    const { fullHeight, viewHeight, scrollbarTrack, scrollbar, content } = control
    const { positionY } = content

    const CALC_SCROLLBAR = scrollbar.height - scrollbarTrack.height
    const CALC_CONTENT = fullHeight - viewHeight

    return -(((((positionY * 100) / CALC_CONTENT) * CALC_SCROLLBAR) / 100))
}

const calcScrolledContent = (control) => {
    const { fullHeight, viewHeight, scrollbarTrack, scrollbar } = control

    const CALC_SCROLLBAR = scrollbar.height - scrollbarTrack.height
    const CALC_CONTENT = fullHeight - viewHeight

    return -(((((scrollbarTrack.positionYMove * 100) / CALC_SCROLLBAR) * CALC_CONTENT) / 100))
}

const isNeedScrollbar = (clientHeight, scrollHeight) => clientHeight !== scrollHeight;

const css = (ref, style) => Object.assign(ref.style, style)

const NativeScroll = (props) => {
    const { children } = props

    const wrapperRef = useRef()
    const contentRef = useRef()
    const scrollbarRef = useRef()
    const scrollbarTrackRef = useRef()

    const controlRef = useRef({
        show: false,
        viewHeight: null,
        fullHeight: null,
        content: {
            positionY: 0,
            setTranslate: (y) => {
                css(contentRef.current, {
                    transform: `translateY(${y}px)`
                })
            },
            animation: {
                on: () => {
                    css(contentRef.current, {
                        transition: `transform .1s linear`
                    })
                },
                off: () => {
                    css(contentRef.current, {
                        transition: 'none'
                    })
                },
            }

        },
        scrollbar: {
            height: null,
            setShow: (bool) => {
                css(scrollbarRef.current, {
                    display: bool ? 'block': 'none'
                })
            }
        },
        scrollbarTrack: {
            height: null,
            isPointer: false,
            positionYMove: 0,
            positionYEnd: 0,
            setHeight: (height) => {
                css(scrollbarTrackRef.current, {
                    height: `${height}px`
                })
            },
            setTop: (top) => {
                css(scrollbarTrackRef.current, {
                    top: `${top}px`
                })
            },
            animation: {
                on: () => {
                    css(scrollbarTrackRef.current, {
                        transition: `top .1s linear`
                    })
                },
                off: () => {
                    css(scrollbarTrackRef.current, {
                        transition: 'none'
                    })
                },
            }
        },
    })

    const control = controlRef.current

    const initial = () => {
        const { clientHeight, scrollHeight } = wrapperRef.current
        const { height } = scrollbarRef.current.getBoundingClientRect()

        if (!isNeedScrollbar(clientHeight, scrollHeight)) {
            control.scrollbar.setShow(false)
            control.show = false
            return
        }

        const { scrollbarTrack, content } = control

        control.show = true
        control.viewHeight = clientHeight
        control.fullHeight = scrollHeight
        control.scrollbar.height = height
        control.scrollbarTrack.height = calcHeightScrollbarTrack(control)

        // const calc = calcScrolledScrollbarTrack(control)
        //
        // content.setTranslate(control.content.positionY)
        //
        // if (!scrollbarTrack.isPointer) {
        //     scrollbarTrack.positionYEnd = calc
        //     scrollbarTrack.setTop(calc)
        // }
        //
        control.scrollbarTrack.setHeight(control.scrollbarTrack.height)
    }

    const onWheel = (event) => {
        if (!control.show) return

        const { scrollbarTrack, content } = control

        handleMovementWheel(control, event)

        handleBoundWheel(control)

        const calc = calcScrolledScrollbarTrack(control)

        content.setTranslate(control.content.positionY)

        scrollbarTrack.positionYEnd = calc
        scrollbarTrack.setTop(calc)
    }

    const onPointerDown = (pointerStart) => {
        pointerStart.preventDefault()

        const { content, scrollbarTrack } = control

        scrollbarTrack.isPointer = true
        scrollbarTrack.positionYMove = pointerStart.pageY
        content.animation.off()
        scrollbarTrack.animation.off()

        document.onpointermove = pointerMove => {
            handleMovementMouse(control, pointerMove, pointerStart)
            handleBoundMouse(control)

            content.positionY = calcScrolledContent(control)

            scrollbarTrack.setTop(control.scrollbarTrack.positionYMove)
            content.setTranslate(control.content.positionY)
        }

        document.onpointerup = () => {
            scrollbarTrack.positionYEnd = scrollbarTrack.positionYMove
            scrollbarTrack.isPointer = false
            content.animation.on()
            scrollbarTrack.animation.on()

            document.onpointermove = null
            document.onpointerup = null
        }
    }

    useEffect(() => {
        initial()
    }, [children, initial])

    return (
        <div ref={wrapperRef} onWheel={onWheel} className="native-scroll">
            <div className="native-scroll-content" ref={contentRef}>
                { children }
            </div>

            <div ref={scrollbarRef} onPointerDown={onPointerDown} className="scrollbar">
                <div ref={scrollbarTrackRef} className="scrollbar-track" />
            </div>
        </div>
    );
};

export default NativeScroll;
