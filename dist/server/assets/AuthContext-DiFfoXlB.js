import { t as supabase } from "./supabase-DsUV4Div.js";
import { createContext, useContext, useEffect, useState } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/contexts/AuthContext.tsx
var AuthContext = createContext({
	session: null,
	user: null,
	loading: true,
	signOut: async () => {}
});
var AuthProvider = ({ children }) => {
	const [session, setSession] = useState(null);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setUser(session?.user ?? null);
			setLoading(false);
		});
		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			setUser(session?.user ?? null);
			setLoading(false);
		});
		return () => subscription.unsubscribe();
	}, []);
	const signOut = async () => {
		await supabase.auth.signOut();
	};
	return /* @__PURE__ */ jsx(AuthContext.Provider, {
		value: {
			session,
			user,
			loading,
			signOut
		},
		children
	});
};
var useAuth = () => {
	return useContext(AuthContext);
};
//#endregion
export { useAuth as n, AuthProvider as t };
