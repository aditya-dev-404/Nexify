import { createContext } from "react";
import { useContext } from "react";


export const ThemeContext = createContext(null);

export const useTheme = ()=>{
    const context = useContext(ThemeContext);
    if(!context){
        throw new Error('theme must be used within an ThemeProvider');
    }
    return context;
}