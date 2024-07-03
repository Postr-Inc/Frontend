export function DeleteModal(props: any) {
    return (
      <dialog
        id={props.id + "delete"}
        className="dialog sm:modal xl:shadow-none md:shadow-none lg:shadow-none bg-transparent focus:outline-none"
      >
        <div className="modal-box xl:shadow-none lg:shadow-none md:shadow-none">
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