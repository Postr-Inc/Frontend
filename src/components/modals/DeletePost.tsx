import { api } from "@/src/api/api";
export function DeleteModal(props: any) {
    return (
      <dialog
        id={props.id + "delete"}
        
        className="  dialog sm:modal xl:shadow-none md:shadow-none lg:shadow-none bg-transparent focus:outline-none rounded    "
      >
        <div 
         style={{
          border: theme == 'dark' ? '1px solid #2d2d2d' : '1px solid #f9f9f9',
          background: theme == 'dark' ? '#121212' : '#f8f7f7',
          borderRadius: '10px',
        }}
        className="modal-box xl:shadow-none lg:shadow-none md:shadow-none rounded bg-transparent">
          <h3 className="font-bold text-lg">Delete Post ?</h3>
          <p className="py-4">
            Are you sure you want to delete this post? This action cannot be
            undone. This will permanently delete access accross the platform.
          </p>
          <div className="modal-action gap-5">
            <form method="dialog" className="flex gap-5">
              <button
                className="text-red-500"
                onClick={() => {
                  api.delete({
                    collection: "posts", 
                    id: props.id,
                    cacheKey: props.cacheKey,
                  });
                  props.setArray(
                    props.array.filter((e: any) => e.id != props.id)
                  );
                  document.getElementById(props.id + "delete")?.close();
                }}
              >
                Delete
              </button>
              <button className=" " data-close>
                Cancel
              </button>
            </form>
          </div>
        </div>
      </dialog>
    );
  }