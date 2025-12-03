import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    selectedTab: 'inbox',
    loggedInUser: null,
    selectedFilter: [],
    inboxNotifications: [],
    issues: []
}

export const appStateSlice = createSlice({
    name: "App State",
    initialState,
    reducers: {
        setSelectedTab: (state, action) => {
            state.selectedTab = action.payload;
        },
        setLoggedInUser: (state, action) => {
            state.loggedInUser = action.payload;
        },
        addFilter: (state, action) => {
            state.selectedFilter.push(action.payload);
        },
        removeFilter: (state, action) => {
            let updatedFilter = state.selectedFilter.filter((ele) => ele !== action.payload);
            state.selectedFilter = updatedFilter;
        },
        addInboxNotification: (state, action) => {
            state.inboxNotifications.push(action.payload);
        },
        removeInboxNotification: (state, action) => {
            let updatedNotifications = state.inboxNotifications.filter((ele: any) => ele.id !== action.payload);
            state.inboxNotifications = updatedNotifications;
        },
        addIssue: (state, action) => {
            state.inboxNotifications.push(action.payload);
        },
        removeIssue: (state, action) => {
            let updatedNotifications = state.inboxNotifications.filter((ele: any) => ele.id !== action.payload);
            state.inboxNotifications = updatedNotifications;
        }
    }
});

export const { setSelectedTab, setLoggedInUser, addFilter, removeFilter, addInboxNotification, removeInboxNotification, addIssue, removeIssue } = appStateSlice.actions;

export default appStateSlice.reducer;