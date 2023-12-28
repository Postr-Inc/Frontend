import { memo } from "react";

export const Loading = memo(function Loading(props: any) {
  return (
    <div
      className={`flex  flex-col gap-4 w-full 
     
    xl:p-2  lg:p-2 md:p-2
    ${props.media ? "rounded h-44 p-0" : "mb-16"}`}
    >
      {props.media ? (
        <div
          className={`skeleton 
      ${props.className ? props.className : "h-42"}
      ${props.media ? "rounded" : "rounded-none"}
      w-full`}
        ></div>
      ) : null}
      {props.hiderows ? null : (
        <>
          <div className="flex gap-4 items-center">
            <div
              className={`skeleton
    ${props.page && props.page == "home" ? "w-16 h-16" : " w-12 h-12"}
    rounded  shrink-0`}
            ></div>
            <div className="flex flex-col gap-4">
              <div className="skeleton h-4 w-32 "></div>
              <div className="skeleton h-4 w-32"></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
});
