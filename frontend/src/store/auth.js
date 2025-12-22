// Simple state management for authentication

let state = {
	isAuthenticated: false,
	user: null,
	token: null,
};

let listeners = [];

/**
 * Get the current state
 * @returns {Object} Current state
 */
export const getState = () => state;

/**
 * Set the authentication state
 * @param {Object} newState - New state object
 */
export const setState = (newState) => {
	state = { ...state, ...newState };
	// Persist token to localStorage
	if (newState.token) {
		localStorage.setItem("token", newState.token);
	} else if (newState.token === null) {
		localStorage.removeItem("token");
	}
	// Notify all listeners
	listeners.forEach((listener) => listener(state));
};

/**
 * Subscribe to state changes
 * @param {Function} listener - Callback function to be called when state changes
 * @returns {Function} Unsubscribe function
 */
export const subscribe = (listener) => {
	listeners.push(listener);
	return () => {
		listeners = listeners.filter((l) => l !== listener);
	};
};

/**
 * Initialize auth state from localStorage
 */
export const initAuthState = () => {
	const token = localStorage.getItem("token");
	if (token) {
		setState({ token, isAuthenticated: true });
	}
};

/**
 * Login user
 * @param {Object} user - User object
 * @param {string} token - JWT token
 */
export const login = (user, token) => {
	setState({ user, token, isAuthenticated: true });
};

/**
 * Logout user
 */
export const logout = () => {
	setState({ user: null, token: null, isAuthenticated: false });
};
