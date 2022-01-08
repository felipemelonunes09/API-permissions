const app = require("../src/app");
const { PORT } = require("../src/enviroment");

    
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})