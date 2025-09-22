import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// Layout
import DashboardLayout from './layouts/DashboardLayout'
import AuthLayout from './layouts/AuthLayout'

// Auth Pages
import Login from './pages/auth/Login'

// Dashboard Pages
import Dashboard from './pages/Dashboard'

// Management Pages
import UserManagement from './pages/users/UserManagement'
import CategoryManagement from './pages/categories/CategoryManagement'
import SubCategoryManagement from './pages/subcategories/SubCategoryManagement'
import AuthorManagement from './pages/authors/AuthorManagement'
import ReaderManagement from './pages/readers/ReaderManagement'
import PublisherManagement from './pages/publishers/PublisherManagement'
import LanguageManagement from './pages/languages/LanguageManagement'
import BookManagement from './pages/books/BookManagement'
import ComingSoonBookManagement from './pages/comingsoon/ComingSoonBookManagement'
import VideoManagement from './pages/videos/VideoManagement'
import TagManagement from './pages/tags/TagManagement'
import AdvertisementManagement from './pages/advertisements/AdvertisementManagement'
import ExpenseManagement from './pages/expenses/ExpenseManagement'
// import ExpenseCategoryManagement from './pages/expensecategories/ExpenseCategoryManagement'
import BackgroundImageManagement from './pages/backgroundimages/BackgroundImageManagement'
import NotificationManagement from './pages/notifications/NotificationManagement'
import PodcastManagement from './pages/podcasts/PodcastManagement'
import EpisodeManagement from './pages/episodes/EpisodeManagement'
// import SubscriptionManagement from './pages/subscriptions/SubscriptionManagement'
import RolePermissionManagement from './pages/roles/RolePermissionManagement'
import FeedbackManagement from './pages/feedback/FeedbackManagement'

// Individual Pages (Add/Edit)
import AddUser from './pages/users/AddUser'
import EditUser from './pages/users/EditUser'
import AddCategory from './pages/categories/AddCategory'
import EditCategory from './pages/categories/EditCategory'
import AddSubCategory from './pages/subcategories/AddSubCategory'
import EditSubCategory from './pages/subcategories/EditSubCategory'
import AddAuthor from './pages/authors/AddAuthor'
import EditAuthor from './pages/authors/EditAuthor'
import AddReader from './pages/readers/AddReader'
import EditReader from './pages/readers/EditReader'
import AddPublisher from './pages/publishers/AddPublisher'
import EditPublisher from './pages/publishers/EditPublisher'
import AddLanguage from './pages/languages/AddLanguage'
import EditLanguage from './pages/languages/EditLanguage'
// import AddBook from './pages/books/AddBook'
// import EditBook from './pages/books/EditBook'
// import AddComingSoonBook from './pages/comingsoon/AddComingSoonBook'
// import EditComingSoonBook from './pages/comingsoon/EditComingSoonBook'
import AddVideo from './pages/videos/AddVideo'
import EditVideo from './pages/videos/EditVideo'
import AddTag from './pages/tags/AddTag'
import EditTag from './pages/tags/EditTag'
// import AddAdvertisement from './pages/advertisements/AddAdvertisement'
// import EditAdvertisement from './pages/advertisements/EditAdvertisement'
// import AddExpense from './pages/expenses/AddExpense'
// import EditExpense from './pages/expenses/EditExpense'
// import AddExpenseCategory from './pages/expensecategories/AddExpenseCategory'
// import EditExpenseCategory from './pages/expensecategories/EditExpenseCategory'
// import AddBackgroundImage from './pages/backgroundimages/AddBackgroundImage'
// import EditBackgroundImage from './pages/backgroundimages/EditBackgroundImage'
import AddNotification from './pages/notifications/AddNotification'
import EditNotification from './pages/notifications/EditNotification'
import AddPodcast from './pages/podcasts/AddPodcast'
import EditPodcast from './pages/podcasts/EditPodcast'
// import AddEpisode from './pages/episodes/AddEpisode'
// import EditEpisode from './pages/episodes/EditEpisode'
// import AddSubscription from './pages/subscriptions/AddSubscription'
// import EditSubscription from './pages/subscriptions/EditSubscription'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          user ? <Navigate to="/dashboard" replace /> : 
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />

      {/* Protected Dashboard Routes */}
      <Route
        path="/*"
        element={
          user ? (
            <DashboardLayout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* User Management */}
                <Route path="/users" element={<UserManagement />} />
                <Route path="/users/add" element={<AddUser />} />
                <Route path="/users/edit/:id" element={<EditUser />} />

                {/* Category Management */}
                <Route path="/categories" element={<CategoryManagement />} />
                <Route path="/categories/add" element={<AddCategory />} />
                <Route path="/categories/edit/:id" element={<EditCategory />} />

                {/* Sub Category Management */}
                <Route path="/subcategories" element={<SubCategoryManagement />} />
                <Route path="/subcategories/add" element={<AddSubCategory />} />
                <Route path="/subcategories/edit/:id" element={<EditSubCategory />} />

                {/* Author Management */}
                <Route path="/authors" element={<AuthorManagement />} />
                <Route path="/authors/add" element={<AddAuthor />} />
                <Route path="/authors/edit/:id" element={<EditAuthor />} />

                {/* Reader Management */}
                <Route path="/readers" element={<ReaderManagement />} />
                <Route path="/readers/add" element={<AddReader />} />
                <Route path="/readers/edit/:id" element={<EditReader />} />

                {/* Publisher Management */}
                <Route path="/publishers" element={<PublisherManagement />} />
                <Route path="/publishers/add" element={<AddPublisher />} />
                <Route path="/publishers/edit/:id" element={<EditPublisher />} />

                {/* Language Management */}
                <Route path="/languages" element={<LanguageManagement />} />
                <Route path="/languages/add" element={<AddLanguage />} />
                <Route path="/languages/edit/:id" element={<EditLanguage />} />

                {/* Book Management */}
                <Route path="/books" element={<BookManagement />} />
                {/* <Route path="/books/add" element={<AddBook />} />
                <Route path="/books/edit/:id" element={<EditBook />} /> */}

                {/* Coming Soon Book Management */}
                <Route path="/coming-soon" element={<ComingSoonBookManagement />} />
                {/* <Route path="/coming-soon/add" element={<AddComingSoonBook />} />
                <Route path="/coming-soon/edit/:id" element={<EditComingSoonBook />} /> */}

                {/* Video Management */}
                <Route path="/videos" element={<VideoManagement />} />
                <Route path="/videos/add" element={<AddVideo />} />
                <Route path="/videos/edit/:id" element={<EditVideo />} />

                {/* Tag Management */}
                <Route path="/tags" element={<TagManagement />} />
                <Route path="/tags/add" element={<AddTag />} />
                <Route path="/tags/edit/:id" element={<EditTag />} />

                {/* Notification Management */}
                <Route path="/notifications" element={<NotificationManagement />} />
                <Route path="/notifications/add" element={<AddNotification />} />
                <Route path="/notifications/edit/:id" element={<EditNotification />} />

                {/* Podcast Management */}
                <Route path="/podcasts" element={<PodcastManagement />} />
                <Route path="/podcasts/add" element={<AddPodcast />} />
                <Route path="/podcasts/edit/:id" element={<EditPodcast />} />

                {/* Advertisement Management */}
                <Route path="/advertisements" element={<AdvertisementManagement />} />
                {/* <Route path="/advertisements/add" element={<AddAdvertisement />} />
                <Route path="/advertisements/edit/:id" element={<EditAdvertisement />} /> */}

                {/* Episode Management */}
                <Route path="/episodes" element={<EpisodeManagement />} />
                {/* <Route path="/episodes/add" element={<AddEpisode />} />
                <Route path="/episodes/edit/:id" element={<EditEpisode />} /> */}

                {/* Expense Management */}
                <Route path="/expenses" element={<ExpenseManagement />} />
                {/* <Route path="/expenses/add" element={<AddExpense />} />
                <Route path="/expenses/edit/:id" element={<EditExpense />} /> */}

                {/* Background Image Management */}
                <Route path="/background-images" element={<BackgroundImageManagement />} />
                {/* <Route path="/background-images/add" element={<AddBackgroundImage />} />
                <Route path="/background-images/edit/:id" element={<EditBackgroundImage />} /> */}

                {/* Role Permission Management */}
                <Route path="/roles" element={<RolePermissionManagement />} />

                {/* Feedback Management */}
                <Route path="/feedback" element={<FeedbackManagement />} />

                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </DashboardLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  )
}

export default App
