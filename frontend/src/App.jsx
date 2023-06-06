import { Routes, Route } from "react-router-dom";
import { Layout, DashLayout, Public } from "./components/index";
import { Login, Welcome, NotesList, UsersList } from "./features/index";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/dash/" element={<DashLayout />}>
          <Route index element={<Welcome />} />
          <Route path="notes">
            <Route index element={<NotesList />} />
          </Route>
          <Route path="users">
            <Route index element={<UsersList />} />
          </Route>
        </Route>
        {/* end of dash */}
      </Route>
    </Routes>
  );
}

export default App;
