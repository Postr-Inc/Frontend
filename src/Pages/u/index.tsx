import useNavigation from "@/src/Utils/Hooks/useNavigation";
import Page from "@/src/Utils/Shared/Page";

export default function User(){
    const { params, route, navigate } = useNavigation("/u/:id");
    return (
        <Page {...{params, route, navigate, id: "user"}}>
            <div class="flex flex-col gap-5">
                <h1>User</h1>
                <p>{params().id}</p>
            </div>
        </Page>
    )
}