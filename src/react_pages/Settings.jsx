import { api } from ".";
import Bottomnav from "../components/Bottomnav";
import Modal from "../components/Modal";

export default  function Settings() {
    return (
        <>
            <div>
                <h2 className="text-2xl px-5 p-10 flex"><svg onClick={() => {
                    window.history.back();
                }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mt-1 mr-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                 Settings</h2>
                 

                <p onClick={() => {
                    document.getElementById("manage").showModal();
                }} className="text-xl pb-5 px-5 flex"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mt-1 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg> Manage Account</p>
                
                <p onClick={() => {
                    document.getElementById("logout").showModal();
                }} className="text-xl pb-5 px-5 flex"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mt-1 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Logout</p>

                <p onClick={() => {
                    window.location.href = "/tos"
                }} className="text-xl pb-5 px-5 flex"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mt-1 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                Terms Of Service</p>

                <p onClick={() => {
                    window.location.href = "/privacy"
                }} className="text-xl pb-5 px-5 flex"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mt-1 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
                </svg>
                Privacy Policy</p>
            </div>
            
            <Modal id="manage" height="h-screen">
                <button className="flex justify-center mx-auto focus:outline-none">
                <div className="divider  text-slate-400  w-12   mt-0"></div>
                </button>
                <div>
                    <h3 className="p-2 mt-5">Your profile won't be avaliable until the next time you login.</h3>
                    <button className="rounded mt-1 p-2 mx-2 bg-amber-500 text-white w-full">Deactivate Account</button>

                    <h3 className="p-2 mt-5">CAUTION! Deleting your account is PERMANENT! Consider deactivating.</h3>
                    <button className="rounded mt-1 p-2 mx-2 bg-red-500 text-white w-full">Delete Account</button>
                </div>
            </Modal>
            <Modal id="logout" height="h-screen">
                <button className="flex justify-center mx-auto focus:outline-none">
                <div className="divider  text-slate-400  w-12   mt-0"></div>
                </button>
                <div>
                    <h3 className="p-2 mt-5">Are you sure you want to logout? You will have to enter credentials again to login.</h3>
                    <button className="rounded mt-1 p-2 mx-2 bg-gray-500 text-white w-full"
                    onClick={() => {
                        api.authStore.clear()
                        window.location.href = "/"
                    }}
                    >Logout</button>
                </div>
            </Modal>
            <Modal id="tos" height="h-screen">
                <button className="flex justify-center mx-auto focus:outline-none">
                <div className="divider  text-slate-400  w-12   mt-0"></div>
                </button>
            </Modal>
            <Modal id="privacy" height="h-screen">
                <button className="flex justify-center mx-auto focus:outline-none">
                <div className="divider  text-slate-400  w-12   mt-0"></div>
                </button>
                <p>Privacy Policy for Postr Social Media App
                <br/>
                <br/>Last Updated: 25 August 2023
                <br/>
                <br/>Welcome to Postr, a social media platform that enables users to connect, share, and communicate with others. Protecting your privacy is important to us. This Privacy Policy outlines how we collect, use, and safeguard your personal information when you use the Postr app.
                <br/>
                <br/>1. Information We Collect
                <br/>
                <br/>	a. Information You Provide: When you register for a Postr account, we collect the information you provide, such as your name, email address, username, and profile picture.
                <br/>
                <br/>	b. Content: We collect the content you create, share, or post on the Postr app, including photos, videos, posts, comments, and messages.
                <br/>
                <br/>	c. Usage Data: We collect information about how you interact with the app, such as your interactions with content, the frequency and duration of your activities, and other usage patterns.
                <br/>
                <br/>	d. Device Information: We may collect information about your device, including the type of device, operating system, unique device identifiers, and mobile network information.
                <br/>
                <br/>2. How We Use Your Information
                <br/>
                <br/>	a. Personalization: We use your information to personalize your experience on the app, including showing you relevant content and connections.
                <br/>
                <br/>	b. Communication: We use your contact information to send you notifications, updates, and promotional materials, as well as to respond to your inquiries.
                <br/>
                <br/>	c. Content Sharing: Your content and profile information are shared with other users as per your privacy settings.
                <br/>
                <br/>	d. Analytics: We analyze user behavior and usage patterns to improve our app's functionality, user experience, and features.
                <br/>
                <br/>	e. Security and Legal Compliance: We may use your information to ensure the security of the app, enforce our Terms of Service, and comply with legal obligations.
                <br/>
                <br/>3. Information Sharing
                <br/>
                <br/>	a. Other Users: Your profile information, posts, and other content may be visible to other users based on your privacy settings.
                <br/>
                <br/>	b. Third Parties: We may share your information with third-party service providers for app-related purposes such as hosting, analytics, and customer support.
                <br/>
                <br/>	c. Legal Requirements: We may share your information when required by law, in response to legal processes, or to protect our rights, privacy, safety, or property.
                <br/>
                <br/>4. Your Choices
                <br/>
                <br/>	a. Account Settings: You can update your account information and privacy settings at any time.
                <br/>
                <br/>	b. Communication Preferences: You can manage your communication preferences in the app settings.
                <br/>
                <br/>	c. Data Access and Deletion: You can request a copy of your data or request its deletion by clicking their respective buttons in settings.
                <br/>
                <br/>5. Security
                <br/>
                <br/>	We employ industry-standard security measures to protect your information from unauthorized access, disclosure, or alteration.
                <br/>
                <br/>6. Children's Privacy
                <br/>
                <br/>	Postr is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately.
                <br/>
                <br/>7. Changes to this Privacy Policy
                <br/>
                <br/>	We may update this Privacy Policy to reflect changes to our practices. We will notify you of any significant changes through the app or other means. Please review the policy periodically.
                <br/>
                <br/>8. Contact Us
                <br/>
                <br/>	If you have questions or concerns about this Privacy Policy, please contact us at postr@post.com.</p>
            </Modal>
            <Bottomnav />
        </>
    )
}