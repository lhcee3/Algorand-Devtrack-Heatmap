import { Outlet } from 'react-router-dom'
import { LayoutPage } from './features/layout/pages/layout-page'
import { Urls } from './routes/urls'
import { evalTemplates } from './routes/templated-route'
import { TransactionPage, transactionPageTitle } from './features/transactions/pages/transaction-page'
import { ExplorePage, explorePageTitle } from './features/explore/pages/explore-page'
import { GroupPage, groupPageTitle } from './features/groups/pages/group-page'
import { ErrorPage } from './features/common/pages/error-page'
import { BlockPage, blockPageTitle } from './features/blocks/pages/block-page'
import { InnerTransactionPage } from './features/transactions/pages/inner-transaction-page'
import { AccountPage, accountPageTitle } from './features/accounts/pages/account-page'
import { AssetPage, assetPageTitle } from './features/assets/pages/asset-page'
import { ApplicationPage, applicationPageTitle } from './features/applications/pages/application-page'
import { SettingsPage, settingsPageTitle } from './features/settings/pages/settings-page'
import { IndexPage } from '@/index-page'
import { NetworkPage } from '@/features/network/pages/network-page'
import { FundPage } from './features/fund/fund-page'
import { FundAuthCallbackPage } from './features/fund/fund-auth-callback-page'
import { FundErrorPage } from './features/fund/fund-error-page'
import { AppLab, appLabPageTitle } from './features/app-lab/pages/app-lab'
import { TransactionWizardPage, transactionWizardPageTitle } from './features/transaction-wizard/transaction-wizard-page'
import { RedirectPage } from './features/common/pages/redirect-page'
import { CreateAppInterface, createAppInterfacePageTitle } from './features/app-interfaces/pages/create-app-interface'
import Heatmap from './features/Heatmap/Heatmap' // Importing Heatmap

export const routes = evalTemplates([
  {
    template: Urls.Index,
    element: (
      <LayoutPage>
        <Outlet />
      </LayoutPage>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        template: Urls.Index,
        element: <IndexPage />,
        errorElement: <ErrorPage title={explorePageTitle} />,
      },
      {
        template: Urls.Explore,
        errorElement: <ErrorPage />,
        element: (
          <NetworkPage>
            <Outlet />
          </NetworkPage>
        ),
        children: [
          {
            template: Urls.Explore,
            element: <ExplorePage />,
            errorElement: <ErrorPage title={explorePageTitle} />,
          },
          {
            template: Urls.Explore.Transaction.ById,
            errorElement: <ErrorPage title={transactionPageTitle} />,
            children: [
              {
                template: Urls.Explore.Transaction.ById,
                element: <TransactionPage />,
              },
              {
                template: Urls.Explore.Transaction.ById.Inner.ById,
                element: <InnerTransactionPage />,
              },
            ],
          },
          {
            template: Urls.Explore.Block.ByRound,
            children: [
              {
                template: Urls.Explore.Block.ByRound,
                errorElement: <ErrorPage title={blockPageTitle} />,
                element: <BlockPage />,
              },
              {
                template: Urls.Explore.Block.ByRound.Group.ById,
                errorElement: <ErrorPage title={groupPageTitle} />,
                element: <GroupPage />,
              },
            ],
          },
          {
            template: Urls.Explore.Account.ByAddress,
            element: <AccountPage />,
            errorElement: <ErrorPage title={accountPageTitle} />,
          },
          {
            template: Urls.Explore.Asset.ById,
            element: <AssetPage />,
            errorElement: <ErrorPage title={assetPageTitle} />,
          },
          {
            template: Urls.Explore.Application.ById,
            errorElement: <ErrorPage title={applicationPageTitle} />,
            element: <ApplicationPage />,
          },
          {
            template: Urls.Explore.Tx,
            element: <RedirectPage from={Urls.Explore.Tx} to={Urls.Explore.Transaction} />,
          },
          {
            template: Urls.Explore.Txn,
            element: <RedirectPage from={Urls.Explore.Txn} to={Urls.Explore.Transaction} />,
          },
        ],
      },
      {
        template: Urls.Heatmap, // Added route for Heatmap
        errorElement: <ErrorPage />,
        element: <Heatmap />,
      },
      {
        template: Urls.AppLab,
        children: [
          {
            template: Urls.AppLab,
            errorElement: <ErrorPage title={appLabPageTitle} />,
            element: <AppLab />,
          },
          {
            template: Urls.AppLab.Create,
            errorElement: <ErrorPage title={createAppInterfacePageTitle} />,
            element: <CreateAppInterface />,
          },
        ],
      },
      {
        template: Urls.Settings,
        errorElement: <ErrorPage title={settingsPageTitle} />,
        element: <SettingsPage />,
      },
      {
        template: Urls.Fund,
        errorElement: <FundErrorPage />,
        element: <FundPage />,
      },
      {
        template: Urls.FundAuthCallback,
        errorElement: <FundErrorPage />,
        element: <FundAuthCallbackPage />,
      },
      {
        template: Urls.TransactionWizard,
        errorElement: <ErrorPage title={transactionWizardPageTitle} />,
        element: <TransactionWizardPage />,
      },
      {
        template: Urls.TxWizard,
        element: <RedirectPage from={Urls.TxWizard} to={Urls.TransactionWizard} />,
      },
      {
        template: Urls.TxnWizard,
        element: <RedirectPage from={Urls.TxnWizard} to={Urls.TransactionWizard} />,
      },
    ],
  },
])
