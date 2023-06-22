import React, { PropsWithChildren, useState } from "react";
import type { AriaModalOverlayProps } from "react-aria";
import { Overlay, useModalOverlay } from "react-aria";
import { OverlayTriggerState } from "react-stately";
import { AriaDialogProps, useDialog } from "react-aria";
import cls from "classnames";
import { useAtom } from "jotai";
import { isEmpty } from "lodash-es";
import { isDarkModeAtom } from "../atoms";

interface ModalProps extends AriaModalOverlayProps {
  state: OverlayTriggerState;
}

export function Modal(props: PropsWithChildren<ModalProps>) {
  const { children, state } = props;
  const [isDarkMode, _] = useAtom(isDarkModeAtom);

  const ref = React.useRef(null);
  const { modalProps, underlayProps } = useModalOverlay(props, state, ref);
  const [exited] = useState(!state.isOpen);

  // Don't render anything if the modal is not open and we're not animating out.
  if (!(state.isOpen || !exited)) {
    return null;
  }

  return (
    <Overlay>
      <div
        className="fixed inset-0 w-screen justify-center z-100 bg-slate-800/50 items-center overflow-auto"
        {...underlayProps}
      >
        <div
          {...modalProps}
          ref={ref}
          className={cls(
            "shadow-2xl2 z-1 h-fit relative focus:outline-none font-sans h-full w-full",
            {
              dark: isDarkMode,
            }
          )}
        >
          {children}
        </div>
      </div>
    </Overlay>
  );
}

interface DialogProps extends AriaDialogProps {
  className?: string;
  title: string;
}

export function Dialog(props: PropsWithChildren<DialogProps>) {
  const { children, className } = props;

  const ref = React.useRef(null);
  const { dialogProps, titleProps } = useDialog(
    {
      ...props,
      role: "alertdialog",
    },
    ref
  );

  return (
    <div
      {...dialogProps}
      ref={ref}
      className={cls(
        "outline-none dark:bg-canvas-dark dark:text-white rounded bg-canvas relative w-fit inset-y-50 m-auto",
        {
          [`${className}`]: !isEmpty(className),
        }
      )}
    >
      <h3
        {...titleProps}
        className="text-lg font-bold text-left text-brand w-fit"
      >
        {props.title}
      </h3>
      <div className="">{children}</div>
    </div>
  );
}
