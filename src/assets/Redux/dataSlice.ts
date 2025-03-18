import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DataState {
  products: any[];  // Change 'any' to the appropriate type
  brands: [];
  catalogs: any[];
  interiors: [];
  tailors: [];
  salesAssociates: [];
  tasks : any[];
  projects : any[];
  customers : [];
  stores : any[];
  items : [];
}

const initialState: DataState = {
  products: [],
  brands: [],
  catalogs: [],
  interiors: [],
  tailors: [],
  salesAssociates: [],
  tasks : [],
  projects : [],
  customers : [],
  stores : [],
  items : [],
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<any[]>) => {
      state.products = action.payload;
    },
    setBrandData: (state, action: PayloadAction<[]>) => {
      state.brands = action.payload;
    },
    setCatalogs: (state, action: PayloadAction<any[]>) => {
      state.catalogs = action.payload;
    },
    setInteriorData: (state, action: PayloadAction<[]>) => {
      state.interiors = action.payload;
    },
    setTailorData: (state, action: PayloadAction<[]>) => {
      state.tailors = action.payload;
    },
    setSalesAssociateData: (state, action: PayloadAction<[]>) => {
      state.salesAssociates = action.payload;
    },
    setTasks : (state, action : PayloadAction<any[]> ) => {
        state.tasks = action.payload;
    },
    setProjects : (state, action : PayloadAction<any[]> ) => {
        state.projects = action.payload;
    },
    setCustomerData: (state, action : PayloadAction<[]> ) => {
        state.customers = action.payload;
    },
    setStoreData: (state, action : PayloadAction<any[]> ) => {
        state.stores = action.payload;
    },
    setItemData : (state, action : PayloadAction<[]> ) => {
        state.items = action.payload;
    },
  },
});

export const {
  setProducts,
  setBrandData,
  setCatalogs,
  setInteriorData,
  setTailorData,
  setSalesAssociateData,
  setTasks,
  setProjects,
  setCustomerData,
  setStoreData,
  setItemData,
} = dataSlice.actions;

export default dataSlice.reducer;