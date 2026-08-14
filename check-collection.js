import { qdrant } from "./lib/qdrant.js";

const collections = await qdrant.getCollections();
console.log("現有的 Collections：", collections.collections.map(c => c.name));