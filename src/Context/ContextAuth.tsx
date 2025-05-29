import { createContext, useReducer } from "react";
import { User } from "firebase/auth";

type stateType = {
    user: User | null;
    loading: boolean;
};

const initialState = {
    user: null,
    loading: false
};

type valueProps = stateType & { dispatch: React.Dispatch<actionType> };

type componentProp = {
    children: React.ReactNode;
};

type userAction = {
    type: "getUser";
    payload: User | null;
};

type loadAction = {
    type: "loading";
    payload: boolean;
};

type actionType = userAction | loadAction;

export const AuthContext = createContext({} as valueProps);

const reducer = (state: stateType, action: actionType) => {
    switch (action.type) {
        case "getUser":
            return { ...state, user: action.payload, loading: false };
        case "loading":
            return { ...state, loading: action.payload };
        default:
            return state;
    }
};

export const ContextAuth = ({ children }: componentProp) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}; 