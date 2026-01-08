import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { FC } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { ButtonLink } from "./button-link";

const btn = cva(
  " text-white px-4 py-1.5 group active-menu-icon relative flex items-stretch justify-center p-0.5 text-center border border-transparent text-white enabled:hover:bg-cyan-800  rounded-md"
);
const buttonVariants = cva(
  "cursor-pointer px-4 py-1.5  relative flex items-stretch justify-center p-0.5 text-center  inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-none bg-primary text-white shadow hover:bg-primary/90 active-menu-icon",
        reject:
          "bg-red-500 text-white shadow hover:bg-red-500 active-menu-icon",
        destructive: "bg-red-500 text-white shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        clean:
          "border-none  bg-background shadow-none hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary border-primary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  tooltip?: any;
  href?: string;
  typeButton?: "button" | "container" | "tooltip";
}

const ButtonBetter = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
const ButtonBetterTooltip = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      typeButton = "button",
      tooltip,
      href,
      className,
      variant,
      size,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    if (tooltip) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-row items-center">
                {href ? (
                  <ButtonLink
                    href={href}
                    className={cn(buttonVariants({ variant, size, className }))}
                    ref={ref}
                    variant={variant}
                  >
                    {props.children}
                  </ButtonLink>
                ) : typeButton === "container" ? (
                  <ButtonContainer
                    className={className}
                    variant={variant}
                    children={props.children}
                  />
                ) : (
                  <Comp
                    className={cn(buttonVariants({ variant, size, className }))}
                    ref={ref}
                    {...props}
                  />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-linear-sidebar-active text-white  border border-primary shadow-md transition-all ">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    if (href) {
      return (
        <ButtonLink
          href={href}
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          variant={variant}
        >
          {props.children}
        </ButtonLink>
      );
    }
    if (typeButton === "container") {
      return (
        <ButtonContainer
          className={className}
          variant={variant}
          children={props.children}
        />
      );
    }
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

const ButtonContainer: FC<any> = ({
  children,
  className,
  variant = "default",
}) => {
  const vr = variant ? variant : "default";
  return (
    <div className={cx(buttonVariants({ variant: vr, className }))}>
      <div className="flex items-center gap-x-0.5 text-sm">{children}</div>
    </div>
  );
};
ButtonBetter.displayName = "Button";

export {
  ButtonBetter,
  ButtonContainer,
  buttonVariants,
  btn,
  ButtonBetterTooltip,
};
