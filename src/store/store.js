import { createStore } from "redux";
import reducer from "./reducer";

const store = createStore(reducer, {
    tasks: []
});

export default store;