export const validateEmail = (email: string) => {

    if (!email.trim()) {
        return "Email is required";
    }

    const emailRegex =
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if (!emailRegex.test(email)) {
        return "Invalid email address";
    }

    return "";
};

export const validatePassword = (password: string) => {

    if (!password.trim()) {
        return "Password is required";
    }

    if (password.length < 6) {
        return "Password must be at least 6 characters";
    }

    return "";
};

export const validateName = (name: string) => {

    if (!name.trim()) {
        return "Name is required";
    }

    if (name.length < 3) {
        return "Name must be at least 3 characters";
    }

    return "";
};