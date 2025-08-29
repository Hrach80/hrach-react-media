import React from 'react';
import '../cotegori/CategorySelector.css';

const CategorySelector = ({ onSelectCategory }) => {
    // Դուք կարող եք ավելացնել ավելի շատ ժանրեր
    const categories = [
        { id: 'all', name: 'Բոլորը' },
        { id: 'dance', name: 'Պարային' },
        { id: 'rock', name: 'Ռոք' },
        { id: 'pop', name: 'Փոփ' },
        { id: 'electronic', name: 'Էլեկտրոնային' },
        { id: 'jazz', name: 'Ջազ' }
    ];

    return (
        <div className="category-selector-container">
            <select onChange={(e) => onSelectCategory(e.target.value)} className="neomorph-select">
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CategorySelector;