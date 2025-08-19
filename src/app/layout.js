'use client'
import './globals.css';
import Header from '../components/Header';
import { Provider } from 'react-redux';
import { store } from "../store";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
          </LocalizationProvider>
        </Provider>
      </body>
    </html>
  );
}