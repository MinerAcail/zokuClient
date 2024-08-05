import * as React from "react"

export function formatBytes(
    bytes: number,
    opts: {
      decimals?: number
      sizeType?: "accurate" | "normal"
    } = {}
  ) {
    const { decimals = 0, sizeType = "normal" } = opts
  
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"]
    if (bytes === 0) return "0 Byte"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
      sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
    }`
  }

  export function composeEventHandlers<E>(
    originalEventHandler?: (event: E) => void,
    ourEventHandler?: (event: E) => void,
    { checkForDefaultPrevented = true } = {}
  ) {
    return function handleEvent(event: E) {
      originalEventHandler?.(event)
  
      if (
        checkForDefaultPrevented === false ||
        !(event as unknown as Event).defaultPrevented
      ) {
        return ourEventHandler?.(event)
      }
    }
  }
  




 export function useCallbackRef<T extends (...args: never[]) => unknown>(
    callback: T | undefined
  ): T {
    const callbackRef = React.useRef(callback)
  
    React.useEffect(() => {
      callbackRef.current = callback
    })
  
    return React.useMemo(
      () => ((...args) => callbackRef.current?.(...args)) as T,
      []
    )
  }


type UseControllableStateParams<T> = {
  prop?: T | undefined
  defaultProp?: T | undefined
  onChange?: (state: T) => void
}

type SetStateFn<T> = (prevState?: T) => T

function useControllableState<T>({
  prop,
  defaultProp,
  onChange = () => {},
}: UseControllableStateParams<T>) {
  const [uncontrolledProp, setUncontrolledProp] = useUncontrolledState({
    defaultProp,
    onChange,
  })
  const isControlled = prop !== undefined
  const value = isControlled ? prop : uncontrolledProp
  const handleChange = useCallbackRef(onChange)

  const setValue: React.Dispatch<React.SetStateAction<T | undefined>> =
    React.useCallback(
      (nextValue) => {
        if (isControlled) {
          const setter = nextValue as SetStateFn<T>
          const value =
            typeof nextValue === "function" ? setter(prop) : nextValue
          if (value !== prop) handleChange(value as T)
        } else {
          setUncontrolledProp(nextValue)
        }
      },
      [isControlled, prop, setUncontrolledProp, handleChange]
    )

  return [value, setValue] as const
}

function useUncontrolledState<T>({
  defaultProp,
  onChange,
}: Omit<UseControllableStateParams<T>, "prop">) {
  const uncontrolledState = React.useState<T | undefined>(defaultProp)
  const [value] = uncontrolledState
  const prevValueRef = React.useRef(value)
  const handleChange = useCallbackRef(onChange)

  React.useEffect(() => {
    if (prevValueRef.current !== value) {
      handleChange(value as T)
      prevValueRef.current = value
    }
  }, [value, prevValueRef, handleChange])

  return uncontrolledState
}

export { useControllableState }
