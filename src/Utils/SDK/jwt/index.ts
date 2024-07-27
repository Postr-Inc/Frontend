export default function isTokenExpired(token: string) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log(payload)
    return payload.exp < Date.now() / 1000;
}