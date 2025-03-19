import { renderToStaticMarkup } from "https://cdn.jsdelivr.net/npm/@usewaypoint/email-builder/+esm";
document.addEventListener("DOMContentLoaded", (event) => {
    setTimeout(() => {
        console.log('Everything is ready');
            
        window.previewPane = document.querySelector('.css-10klw3m');
        window.editButton = document.querySelectorAll('.css-1xlddgv')[2];
        window.previewButton = document.querySelectorAll('.css-1xlddgv')[3];
        
        
        class UndoRedoManager {
            constructor(getDataFn, loadDataFn) {
                this.getDataFn = getDataFn; // Function to get current state
                this.loadDataFn = loadDataFn; // Function to load a state
                this.undoStack = [];
                this.redoStack = [];
                this.currentState = null;
            }
        
            async initialize() {
                this.currentState = JSON.stringify(await this.getDataFn());
            }
        
            async performAction() {
                const newState = JSON.stringify(await this.getDataFn());
                if (this.currentState !== newState) {
                    this.undoStack.push(this.currentState);
                    this.currentState = newState;
                    this.redoStack = [];
                }
            }
        
            async undo() {
                if (this.undoStack.length > 0) {
                    this.redoStack.push(this.currentState);
                    this.currentState = this.undoStack.pop();
                    await this.loadDataFn(JSON.parse(this.currentState));
                }
            }
        
            async redo() {
                if (this.redoStack.length > 0) {
                    this.undoStack.push(this.currentState);
                    this.currentState = this.redoStack.pop();
                    await this.loadDataFn(JSON.parse(this.currentState));
                }
            }
        }
        
        window.EmailBuilder = {
            jsonData: async function () {
                const contentUrl = document.querySelectorAll('.css-17kijze')[1].href;
                const decodedContent = decodeURIComponent(contentUrl.split(",")[1]);
                return JSON.parse(decodedContent);
            },
        
            htmlData: async function () {
                const jsonData = await this.jsonData();
                return renderToStaticMarkup(jsonData, { rootBlockId: "root" });
            },
        
            loadJsonData: async function (json) {
                resetDocument(json);
            }
        };
        
        // Initialize Undo/Redo Manager
        const emailHistory = new UndoRedoManager(window.EmailBuilder.jsonData, window.EmailBuilder.loadJsonData);
        emailHistory.initialize();
        
        // Attach to global EmailBuilder object
        window.EmailBuilder.history = emailHistory;
        
        // Example Usage:
        async function saveState() {
            await emailHistory.performAction();
        }
        
        async function undoChange() {
            await emailHistory.undo();
        }
        
        async function redoChange() {
            await emailHistory.redo();
        }
        
        let savingState = false;
        ["click", "keydown"].forEach(event => 
            document.addEventListener(event, function(e) {
                let exceptionKeys = ["Control", "Meta", "Alt", "Shift", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
                if (event === "keydown" && ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "y") || exceptionKeys.includes(e.key))) {
                    if (e.key === "z") {
                        undoChange();
                    } else {
                        redoChange();
                    }
        
                    return;
                }
        
                if (!savingState) {
                    setTimeout(async () => {
                        savingState = true;
                        await saveState().then(() => savingState = false);
                    }, 500);
                }
            }, { capture: true })
        );
    }, 1000)

})