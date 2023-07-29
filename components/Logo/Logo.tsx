import clsx from "clsx"
import { ComponentProps } from "react"
import styles from "./Logo.module.css"

export function Logo({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={clsx(className, styles.logo)} {...props}>
      <svg
        className={styles.mark}
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        // xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 512 512"
        // style="enable-background:new 0 0 512 512;"
        // xml:space="preserve"
      >
        <path
          style={{ fill: "#777" }}
          d="M495,466.2L377.2,348.4c29.2-35.6,46.8-81.2,46.8-130.9C424,103.5,331.5,11,217.5,11
C103.4,11,11,103.5,11,217.5S103.4,424,217.5,424c49.7,0,95.2-17.5,130.8-46.7L466.1,495c8,8,20.9,8,28.9,0
C503,487.1,503,474.1,495,466.2z M217.5,382.9C126.2,382.9,52,308.7,52,217.5S126.2,52,217.5,52C308.7,52,383,126.3,383,217.5
S308.7,382.9,217.5,382.9z"
        />
        <path
          style={{ fill: "#777" }}
          d="M495,466.2L377.2,348.4c29.2-35.6,46.8-81.2,46.8-130.9C424,103.5,331.5,11,217.5,11
C103.4,11,11,103.5,11,217.5S103.4,424,217.5,424c49.7,0,95.2-17.5,130.8-46.7L466.1,495c8,8,20.9,8,28.9,0
C503,487.1,503,474.1,495,466.2z M217.5,382.9C126.2,382.9,52,308.7,52,217.5S126.2,52,217.5,52C308.7,52,383,126.3,383,217.5
S308.7,382.9,217.5,382.9z"
        />
      </svg>
      <span className={styles.wordmark}>AudGit</span>
    </div>
  );
}
