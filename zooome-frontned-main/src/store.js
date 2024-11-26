import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {
        // test: testSlice.reducer
    }
});


export default store;