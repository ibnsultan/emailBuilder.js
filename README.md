# EmailBuilder.js Documentation

Email Builder JS implementation with Plain HTML files.

## API Documentation

### **Replace Email Content**

This function allows you to replace the current email content with new data. It is primarily used to load the structure and design of the email.

```javascript
EmailBuilder.loadData(json)
```

**Parameters:**
- `json` (Object): The JSON object containing the layout and content of the email.

**Example Usage:**

```javascript
EmailBuilder.loadData({
  "root": {
    "type": "EmailLayout",
    "data": {
      "backdropColor": "#F5F5F5",
      "canvasColor": "#FFFFFF",
      "textColor": "#262626",
      "fontFamily": "MODERN_SANS",
      "childrenIds": [
        "block-1713199011299"
      ]
    }
  },
  "block-1713199011299": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "text": "Hello world"
      }
    }
  }
})
```

### **Export Data**

This method allows you to export the current email content in either JSON or HTML format.

- **Export as JSON:**

```javascript
EmailBuilder.jsonData()
```

- **Export as HTML:**

```javascript
EmailBuilder.htmlData()
```

### **Build Changes History**

This method manages the history of changes made to the email content, enabling undo/redo actions using `Ctrl + Z` (Undo) and `Ctrl + Y` (Redo).

```javascript
EmailBuilder.history
```

The history object tracks all the changes made and allows you to roll back or reapply changes as needed.

## Credits

This project is built on top of [usewaypoint's EmailBuilder.js](https://github.com/usewaypoint/email-builder-js). 