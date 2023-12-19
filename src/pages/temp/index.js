import { useEffect } from "react";

const temp = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return (
        <>
        </>
    )
}

export default temp;