# 🎯 Mango Range Component

Custom dual-handle Range slider component built with **Next.js 16**, **TypeScript**, and **Vitest**.

> Technical test for Mango - Frontend Developer position

## 🌐 Live Demo

**[View Live Demo on Vercel →](https://range-component-ochre.vercel.app/)**

- **Exercise 1**: [Normal Range](https://range-component-ochre.vercel.app/exercise1) - Editable min/max values (1-100)
- **Exercise 2**: [Fixed Values Range](https://range-component-ochre.vercel.app/exercise2) - Predefined currency values

## ✨ Features

- 🎨 **Dual-handle slider** with smooth drag interactions
- ✏️ **Editable inputs** with real-time validation
- 💰 **Currency formatting** (€) with proper decimals
- ♿ **Accessible** (ARIA attributes, keyboard navigation)
- 🧪 **50+ tests** with 100% pass rate
- 🛡️ **Defensive error handling** for edge cases
- 🎭 **Custom mock services** simulating network delay

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server (localhost:8080)
npm run dev

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── app/
│   ├── exercise1/          # Normal range (1-100, editable)
│   │   ├── page.tsx
│   │   ├── page.test.tsx   # 7 integration tests
│   │   └── page.module.css
│   └── exercise2/          # Fixed values range (currency)
│       ├── page.tsx
│       ├── page.test.tsx   # 10 integration tests
│       └── page.module.css
├── components/
│   └── Range/              # Reusable Range component
│       ├── Range.tsx       # Main component logic
│       ├── Range.test.tsx  # 31 unit tests
│       ├── Range.module.css
│       └── index.ts
├── services/
│   ├── rangeService.ts     # Mock API services
│   └── rangeService.test.ts # 9 service tests
└── types/
    └── range.types.ts      # TypeScript interfaces
```

## 🎯 Exercises

### Exercise 1: Normal Range
- URL: `http://localhost:8080/exercise1`
- Min/Max values from service (1-100)
- **Editable inputs** with validation
- Currency format (€)
- Real-time sync between handles and inputs

### Exercise 2: Fixed Values Range
- URL: `http://localhost:8080/exercise2`
- Predefined values: `[1.99, 5.99, 10.99, 30.99, 50.99, 70.99]`
- **Non-editable** display values
- Visual highlighting of selected range
- Snap-to-value behavior

## 🧪 Testing Strategy

**Total: 57 tests** covering:

### Service Tests (9 tests)
- Response structure validation
- Correct data values
- Async behavior
- Network delay simulation

### Component Tests (31 tests)
- Rendering & accessibility (ARIA)
- User interactions (drag, input editing)
- Validation & boundary checks
- Props updates & re-rendering
- Edge cases (undefined, empty arrays, extreme values)

### Integration Tests (17 tests)
- Exercise 1: Loading, errors, service integration
- Exercise 2: Fixed values, currency, edge cases
- Full page + component + service flow

## 🛠️ Technical Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **React 19** | Latest React with concurrent features |
| **TypeScript** | Type safety (strict mode) |
| **Vitest** | Fast unit testing with JSdom |
| **React Testing Library** | Component testing best practices |
| **CSS Modules** | Scoped styling |
| **Custom Hooks** | `useRef`, `useState`, `useEffect` |

## 🎨 Design Decisions

### Why Vitest over Jest?
- ⚡ **Faster**: Native ESM support
- 🔧 **Better DX**: Hot reload, watch mode
- 🎯 **Modern**: Built for Vite ecosystem
- 📦 **Smaller**: Less configuration needed

### Why CSS Modules?
- 🔒 **Scoped styles**: No naming conflicts
- 📦 **No external deps**: No need for styled-components
- 🎨 **Full control**: Custom Mango design system
- ⚡ **Performance**: Static extraction at build time

### Why Custom Mock Services?
- 🚀 **No external dependencies**: Works offline
- ⚙️ **Full control**: Easy to modify test data
- 🎯 **Predictable**: Consistent behavior
- ⚡ **Fast**: No real network latency

## 🧩 Component API

### Range Component

```typescript
<Range
  type="normal" | "fixed"
  minValue={number}
  maxValue={number}
  currentMin={number}
  currentMax={number}
  onMinChange={(value: number) => void}
  onMaxChange={(value: number) => void}
  fixedValues={number[]}        // Optional: for type="fixed"
  formatValue={(value) => string} // Optional: custom formatting
  editable={boolean}             // Optional: enable input editing
/>
```

## 🔍 Key Features Implementation

### Drag & Drop Logic
- Mouse position → percentage calculation
- `getBoundingClientRect()` for accurate positioning
- Handle collision prevention (min can't exceed max)
- Smooth visual feedback with CSS transforms

### Input Validation
- Real-time parsing with `parseFloat()`
- Boundary clamping (min ≤ value ≤ max)
- Decimal precision (2 decimals)
- NaN handling with fallback to previous value

### Error Handling
- ✅ Validates undefined props
- ✅ Handles empty `fixedValues` arrays
- ✅ User-friendly error messages
- ✅ Graceful degradation

## 📊 Test Coverage

```
✓ src/services/rangeService.test.ts     (9 tests)
✓ src/components/Range/Range.test.tsx   (31 tests)
✓ src/app/exercise1/page.test.tsx       (7 tests)
✓ src/app/exercise2/page.test.tsx       (10 tests)

Total: 57 tests | 57 passed | 0 failed
```

## 🚢 Deployment Ready

```bash
# Production build
npm run build

# Start production server
npm start
```

## 👨‍💻 Development

Built with ❤️ for Mango technical test

**Author**: Miranda Callejón Huertes  
**Repository**: [github.com/mcallejo-10/range-component](https://github.com/mcallejo-10/range-component)
