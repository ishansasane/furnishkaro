import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DataState {
  products: any[];  // Change 'any' to the appropriate type
  brands: any[];
  catalogs: any[];
  interiors: any[];
  tailors: any[];
  salesAssociates: any[];
  tasks : any[];
  projects : any[];
  customers : any[];
  stores : any[];
  items : any[];
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
    setBrands: (state, action: PayloadAction<any[]>) => {
      state.brands = action.payload;
    },
    setCatalogs: (state, action: PayloadAction<any[]>) => {
      state.catalogs = action.payload;
    },
    setInteriors: (state, action: PayloadAction<any[]>) => {
      state.interiors = action.payload;
    },
    setTailors: (state, action: PayloadAction<any[]>) => {
      state.tailors = action.payload;
    },
    setSalesAssociates: (state, action: PayloadAction<any[]>) => {
      state.salesAssociates = action.payload;
    },
    setTasks : (state, action : PayloadAction<any[]> ) => {
        state.tasks = action.payload;
    },
    setProjects : (state, action : PayloadAction<any[]> ) => {
        state.projects = action.payload;
    },
    setCustomerData: (state, action : PayloadAction<any[]> ) => {
        state.customers = action.payload;
    },
    setStoreData: (state, action : PayloadAction<any[]> ) => {
        state.stores = action.payload;
    },
    setItemData : (state, action : PayloadAction<any[]> ) => {
        state.items = action.payload;
    },
  },
});

export const {
  setProducts,
  setBrands,
  setCatalogs,
  setInteriors,
  setTailors,
  setSalesAssociates,
  setTasks,
  setProjects,
  setCustomerData,
  setStoreData,
  setItemData,
} = dataSlice.actions;

export default dataSlice.reducer;