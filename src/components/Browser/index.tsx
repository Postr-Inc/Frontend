import { createSignal } from "solid-js";
 
export default function Browser(){
    let [url, setUrl] = createSignal("");
    let [loading, setLoading] = createSignal(false);
    let [error, setError] = createSignal(false);
    return (
        <div class="modal">
            <div class="modal-box">
                <div class="modal-header">
                    <h2>Modal Title</h2>
                    <button class="btn btn-clear" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Modal content</p>
                </div>
            </div>
        </div>
    )
}