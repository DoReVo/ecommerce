import cls from "classnames";
import { isEmpty } from "lodash-es";
import { ForwardedRef, forwardRef, HTMLProps } from "react";

interface Props extends HTMLProps<HTMLTextAreaElement> {
  className?: string;
  [x: string]: any;
}

type ComponentSignature = (
  props: Props,
  ref: ForwardedRef<HTMLTextAreaElement>
) => ReturnType<typeof TextAreaInput>;

function TextAreaInput(props: Props, ref: ForwardedRef<HTMLTextAreaElement>) {
  const { className, ...restOfProps } = props;

  return (
    <textarea
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

export default forwardRef<HTMLTextAreaElement, Props>(
  TextAreaInput
) as ComponentSignature;
