export async function init(){
    console.log("Initializing API...");
    try {
        let move = await getPredictedMove();
        console.log("ApiTools.js");
        console.log(move);
    } catch (error) {
        console.error("Error in init:", error);
    }
}

// Simple script to prediction
async function getPredictedMove() {
    try {
        // Make a GET request to the Flask server's /predict endpoint
        const response = await fetch('http://127.0.0.1:5000/predict');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Access the predicted input from the response
        console.log(`Predicted input: ${data.input}`);

        // Use the predicted move (e.g., simulate a key press)
        performAction(data.input);

    } catch (error) {
        console.error('Error fetching prediction:', error);
    }
}

// Simulate an action based on the predicted input
function performAction(input) {
    switch (input) {
        case 'w':
            console.log('Move Up');
            break;
        case 'a':
            console.log('Move Left');
            break;
        case 's':
            console.log('Move Down');
            break;
        case 'd':
            console.log('Move Right');
            break;
        case 'e':
            console.log('Perform Special Action');
            break;
        default:
            console.log('Unknown input:', input);
    }
}
