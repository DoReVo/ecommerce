import cls from "classnames";
import { isEmpty } from "lodash-es";
import { ForwardedRef, forwardRef, HTMLProps } from "react";

interface Props extends HTMLProps<HTMLInputElement> {
  className?: string;
  [x: string]: any;
}

type ComponentSignature = (
  props: Props,
  ref: ForwardedRef<HTMLInputElement>
) => ReturnType<typeof TextInput>;

function TextInput(props: Props, ref: ForwardedRef<HTMLInputElement>) {
  const { className, ...restOfProps } = props;

  return (
    <input
      ref={ref}
      {...restOfProps}
      className={cls(
        { [`${className}`]: !isEmpty(className) },
        "w-full rounded px-2 py-1 dark:text-white bg-inherit",
        "border"
      )}
    />
  );
}

export default forwardRef<HTMLInputElement, Props>(
  TextInput
) as ComponentSignature;
