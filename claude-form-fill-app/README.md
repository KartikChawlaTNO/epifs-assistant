# Claude Form Fill Application

This project is a React application designed to allow users to input a document and receive an automated form-fill output. The application features a clean user interface styled in the Claude style with blue accents.

## Project Structure

```
claude-form-fill-app
├── public
│   └── index.html          # Main HTML entry point
├── src
│   ├── components          # React components
│   │   ├── DocumentInput.tsx  # Component for document input
│   │   ├── FormFillOutput.tsx # Component for displaying form-fill output
│   │   └── UITheme.tsx        # Component for applying UI theme
│   ├── styles              # CSS styles
│   │   └── claude-theme.css # Styles for Claude theme
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Entry point for the React application
├── package.json            # npm configuration file
├── tsconfig.json           # TypeScript configuration file
└── README.md               # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd claude-form-fill-app
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the application:**
   ```
   npm start
   ```

   This will start the development server and open the application in your default web browser.

## Usage Guidelines

- Users can upload or input a document using the `DocumentInput` component.
- The application processes the document and displays the automated form-fill output using the `FormFillOutput` component.
- The UI is styled with a clean design and blue accents, ensuring a pleasant user experience.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.