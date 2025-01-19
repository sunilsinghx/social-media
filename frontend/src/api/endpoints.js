import axios from "axios"
import { SERVER_URL } from "../constants/constant.js"

// Set up the base URL for the API
const BASE_URL = SERVER_URL

// Create an Axios instance with a specific base URL and credentials option
const api = axios.create({
    baseURL: BASE_URL,  // Base URL for all requests
    withCredentials: true // Ensures that cookies (like session tokens) are included in requests
})

// Adding a response interceptor to handle errors globally (e.g., authentication errors)
api.interceptors.response.use(
    (response) => response, // If the response is successful, simply return it
    async (error) => {
        // Save the original request configuration
        const original_request = error.config

        // Check if the error is due to a 401 Unauthorized response
        if (error.response?.status === 401 && !original_request._retry) {
            // If we haven't already retried the request
            original_request._retry = true
            try {
                // Attempt to refresh the token
                await refresh_token()
                // Retry the original request after refreshing the token
                return api(original_request)
            } catch (error) {
                // If refreshing the token fails, redirect to login page
                window.location.href = "/login"
                return Promise.reject(error)
            }
        }
        // Reject the error and propagate it if it's not a 401 error
        return Promise.reject(error)
    }
)

// Function to refresh the authentication token
export const refresh_token = async () => {
    // Send a POST request to refresh the token
    const response = await api.post('/token/refresh/')
    return response.data // Return the new token data
}

// Function to login a user
export const login = async (username, password) => {
    // Send a POST request with username and password to authenticate
    const response = await api.post('/token/', { username, password })
    return response.data // Return the login response data (token)
}

// Function to register a new user
export const register = async (username, email, firstName, lastName, password) => {
    // Send a POST request to register a new user with the provided information
    const response = await api.post('/register/', {
        username: username,
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password
    })
    return response.data // Return the registration response data
}

// Function to log out a user
export const logout = async () => {
    // Send a POST request to log out the user
    const response = await api.post('/logout/')
    return response.data // Return the response from logout
}

// Function to get authentication status (whether the user is logged in)
export const get_auth = async () => {
    // Send a GET request to check if the user is authenticated
    const response = await api.get('/authenticated/')
    return response.data // Return the authentication status
}

// User-related API functions

// Function to get a user's profile data
export const get_user_profile_data = async (username) => {
    // Send a GET request to fetch user data based on username
    const response = await api.get(`/user_data/${username}/`)
    return response.data // Return the user profile data
}

// Function to follow/unfollow a user
export const toggleFollow = async (username) => {
    // Send a POST request to toggle follow/unfollow status
    const response = await api.post('/toggle_follow/', { username: username })
    return response.data // Return the follow status update response
}

// Function to search for users based on a search query
export const search_users = async (search) => {
    // Send a GET request with the search query
    const response = await api.get(`/search/?query=${search}`)
    return response.data // Return the search results
}

// Function to update user information (e.g., profile picture, name, etc.)
export const update_user = async (values) => {
    // Send a PATCH request to update user data with multipart form data
    const response = await api.patch('/update_user/', values, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data // Return the update response
}

// Post-related API functions

// Function to create a new post
export const create_post = async (description) => {
    // Send a POST request to create a new post with a description
    const response = await api.post('/create_post/', { description: description })
    return response.data // Return the created post data
}

// Function to like or unlike a post
export const toggleLike = async (id) => {
    // Send a POST request to toggle the like status of a post
    const response = await api.post('/toggleLike/', { id: id })
    return response.data 
}

// Function to get a list of posts based on pagination
export const get_posts = async (num) => {
    // Send a GET request to fetch posts for a specific page number
    const response = await api.get(`/get_posts/?page=${num}`)
    return response.data
}

// Function to get posts by a specific user
export const get_users_posts = async (username) => {
    // Send a GET request to fetch posts of a specific user
    const response = await api.get(`/posts/${username}`)
    return response.data
}
