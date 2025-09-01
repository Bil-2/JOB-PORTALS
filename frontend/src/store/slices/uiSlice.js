import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: localStorage.getItem('theme') || 'light',
  sidebarOpen: false,
  modals: {
    jobDetails: { isOpen: false, jobId: null },
    applicationForm: { isOpen: false, jobId: null },
    confirmDialog: { isOpen: false, title: '', message: '', onConfirm: null },
  },
  loading: {
    global: false,
    jobs: false,
    applications: false,
  },
  searchFilters: {
    query: '',
    category: '',
    location: '',
    salaryRange: [0, 200000],
    jobType: '',
    experience: '',
  },
  pagination: {
    jobs: { page: 1, limit: 10, total: 0 },
    applications: { page: 1, limit: 10, total: 0 },
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    openModal: (state, action) => {
      const { modalName, data = {} } = action.payload;
      state.modals[modalName] = { isOpen: true, ...data };
    },
    closeModal: (state, action) => {
      const modalName = action.payload;
      state.modals[modalName] = { ...state.modals[modalName], isOpen: false };
    },
    setLoading: (state, action) => {
      const { key, value } = action.payload;
      state.loading[key] = value;
    },
    setSearchFilters: (state, action) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload };
    },
    clearSearchFilters: (state) => {
      state.searchFilters = initialState.searchFilters;
    },
    setPagination: (state, action) => {
      const { key, data } = action.payload;
      state.pagination[key] = { ...state.pagination[key], ...data };
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  setLoading,
  setSearchFilters,
  clearSearchFilters,
  setPagination,
} = uiSlice.actions;

export const selectTheme = (state) => state.ui.theme;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectModals = (state) => state.ui.modals;
export const selectLoading = (state) => state.ui.loading;
export const selectSearchFilters = (state) => state.ui.searchFilters;
export const selectPagination = (state) => state.ui.pagination;

export default uiSlice.reducer;
