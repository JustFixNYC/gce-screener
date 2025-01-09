import classNames from "classnames";

export const CheckPlusIcon: React.FC<{
  className?: string;
  title?: string;
}> = ({ className, title }) => (
  <svg
    viewBox="0 0 39 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={classNames("check-plus", className)}
  >
    {title && <title>{title}</title>}
    <path
      d="M5 17.4L13.4 25.8L31.4 7.79999"
      stroke="currentcolor"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M32 16.6L32 26.6"
      stroke="currentcolor"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M37 21.6L27 21.6"
      stroke="currentcolor"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);
