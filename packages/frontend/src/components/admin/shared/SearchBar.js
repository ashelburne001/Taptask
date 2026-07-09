import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
export default function SearchBar({ onSearch, placeholder = 'Search...', debounceMs = 300, }) {
    const [query, setQuery] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query);
        }, debounceMs);
        return () => clearTimeout(timer);
    }, [query, onSearch, debounceMs]);
    return (_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-3 w-5 h-5 text-gray-400" }), _jsx("input", { type: "text", value: query, onChange: (e) => setQuery(e.target.value), placeholder: placeholder, className: "w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accentblue" }), query && (_jsx("button", { onClick: () => setQuery(''), className: "absolute right-3 top-3 p-1 hover:bg-gray-100 rounded", children: _jsx(X, { className: "w-4 h-4 text-gray-400" }) }))] }));
}
//# sourceMappingURL=SearchBar.js.map