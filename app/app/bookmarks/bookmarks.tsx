import { useRef, useState } from "react";
import { api } from "../page";
export default function Bookmarks(props: any) {
  let initialized = useRef(false);
  let [bookmarks, setBookmarks] = useState<any>([]);
  async function loadBookmarks() {
    let res: any = await api.list({
      collection: "users",
      page: 0,
      limit: 1,
      expand: ["bookmarks", "bookmarks.author", "bookmarks.comments"],
      filter: `id= "${api.authStore.model.id}"`,
    });
    setBookmarks(res.items[0].expand.bookmarks);
          
  }
  if (!initialized.current) {
    loadBookmarks();
    initialized.current = true;
  }
  return <div></div>;
}
