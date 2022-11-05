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
    eventMoveY,
    eventStartY,
    pointerStart,
) => {
    const { scrollbarTrack } = control
    const { pointer } = scrollbarTrack

    pointer.move = (((eventMoveY.pageY - eventStartY.pageY)) + pointerStart)
}

const handleBoundMouse = (
    control,
) => {
    const { scrollbar, scrollbarTrack } = control
    const { pointer } = scrollbarTrack

    const CALC_SCROLLBAR_HEIGHT = scrollbar.height - scrollbarTrack.height

    if (pointer.move > CALC_SCROLLBAR_HEIGHT) {
        pointer.move = CALC_SCROLLBAR_HEIGHT
    }

    if (pointer.move < 0) {
        pointer.move = 0
    }
}

const calcHeightScrollbarTrack = (control) => {
    const { fullHeight, viewHeight } = control
    const { height } = control.scrollbar

    let percent = ((viewHeight * 100) / fullHeight)

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
    const { pointer } = scrollbarTrack

    const CALC_SCROLLBAR = scrollbar.height - scrollbarTrack.height
    const CALC_CONTENT = fullHeight - viewHeight

    return -(((((pointer.move * 100) / CALC_SCROLLBAR) * CALC_CONTENT) / 100))
}

const preventDefault = e => e.preventDefault()

const browserOffScroll = () => window.addEventListener("wheel", preventDefault, { passive:false })
const browserOnScroll = () => window.removeEventListener("wheel", preventDefault)

const isNeedScrollbar = (clientHeight, fullHeight) => {
    if (fullHeight > clientHeight) {
        return true
    }
}

const css = (ref, style) => Object.assign(ref.style, style)

const NativeScroll = (props) => {
    const {
        style,
        children
    } = props

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
            pointer: {
                diff: 0,
                move: 0,
                start: 0
            },
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

    const init = () => {
        const { clientHeight } = wrapperRef.current

        const HEIGHT_CONTENT = contentRef.current.getBoundingClientRect().height
        const HEIGHT_SCROLLBAR = scrollbarRef.current.getBoundingClientRect().height

        if (!isNeedScrollbar(clientHeight, HEIGHT_CONTENT)) {
            control.scrollbar.setShow(false)
            control.show = false
            return
        } else {
            control.scrollbar.setShow(true)
            control.show = true
        }

        const { scrollbarTrack } = control

        control.viewHeight = clientHeight
        control.fullHeight = HEIGHT_CONTENT
        control.scrollbar.height = HEIGHT_SCROLLBAR
        control.scrollbarTrack.height = calcHeightScrollbarTrack(control)

        control.scrollbarTrack.setHeight(control.scrollbarTrack.height)

        const calc = calcScrolledScrollbarTrack(control)

        scrollbarTrack.pointer.start = calc

        scrollbarTrack.setTop(calc)
    }

    const onWheel = (event) => {
        window.onscroll = null
        if (!control.show) return

        const { scrollbarTrack, content } = control

        handleMovementWheel(control, event)

        handleBoundWheel(control)

        const calc = calcScrolledScrollbarTrack(control)

        content.setTranslate(control.content.positionY)

        scrollbarTrack.pointer.start = calc
        scrollbarTrack.setTop(calc)
    }

    const onPointerDown = (eventStart) => {
        eventStart.preventDefault()

        const { content, scrollbarTrack } = control

        const pointerStartY = scrollbarTrack.pointer.start

        content.animation.off()
        scrollbarTrack.animation.off()

        const onPointerMove = (eventMove) => {
            handleMovementMouse(control, eventMove, eventStart, pointerStartY)
            handleBoundMouse(control)

            content.positionY = calcScrolledContent(control)

            scrollbarTrack.setTop(control.scrollbarTrack.pointer.move)
            content.setTranslate(control.content.positionY)
        }

        const onPointerUp = () => {
            scrollbarTrack.pointer.start = scrollbarTrack.pointer.move

            content.animation.on()
            scrollbarTrack.animation.on()

            document.removeEventListener('pointermove', onPointerMove)
            document.removeEventListener('pointerup', onPointerUp)
        }

        document.addEventListener('pointermove', onPointerMove)
        document.addEventListener('pointerup', onPointerUp)
    }

    const onPointerEnter = () => browserOffScroll()

    const onPointerLeave = () => browserOnScroll()

    useEffect(() => {
        init()
    }, [children])

    return (
        <div ref={wrapperRef} onWheel={onWheel} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave} className="native-scroll" style={style}>
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
