import { useAuthStore } from '../../store/auth.store';
import { NotificationList } from '../Notifications/NotificationList';
import { ActivityChart } from '../Analytics/ActivityChart';
import { MessageList } from '../Chat/MessageList';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="main-layout">
      <header>
        <nav>
          {user ? (
            <>
              <span>Welcome, {user.name}</span>
              <button onClick={useAuthStore.getState().logout}>Logout</button>
            </>
          ) : (
            <a href="/login">Login</a>
          )}
        </nav>
      </header>

      <main>
        {children}
      </main>

      {user && (
        <aside>
          <NotificationList />
        </aside>
      )}
    </div>
  );
};