#pip install requests pandas numpy plotly
#version -10: tracks all changes of the wallet. integrated selction system for 3 types of heatmap visualiztion. Enhanced colors.
import requests
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go

indexer_url = "https://mainnet-idx.algonode.cloud"


def fetch_token_balances(asset_id):
    balances = []
    next_token = ""
    
    while True:
        try:
            url = f"{indexer_url}/v2/assets/{asset_id}/balances"
            params = {"next": next_token} if next_token else {}
            response = requests.get(url, params=params)
            response.raise_for_status()  # Raise an error for bad responses
            data = response.json()
        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {e}")
            break
        
        balances.extend(data['balances'])
        next_token = data.get('next-token')
        if next_token is None:
            break
    
    return balances

# Set the ASA (Asset ID)
ASSET_ID = 1691271561
token_balances = fetch_token_balances(ASSET_ID)


df = pd.DataFrame(token_balances)
df['amount'] = df['amount'].astype(float)


N = 50
top_wallets = df.nlargest(N, 'amount')
top_wallets['wallet_index'] = top_wallets.index


def show_heatmap():
    top_wallets['normalized_amount'] = np.log10(top_wallets['amount'])


    rows, cols = 5, 10  
    top_wallets['row'] = np.repeat(range(1, rows + 1), cols)
    top_wallets['col'] = list(range(1, cols + 1)) * rows

   
    heatmap_data = top_wallets.pivot(index='row', columns='col', values='normalized_amount')

    fig = px.imshow(
        heatmap_data.values,
        labels=dict(x="Wallet Column Index", y="Wallet Row Index", color="Log10 Token Amount"),
        x=heatmap_data.columns,
        y=heatmap_data.index,
        color_continuous_scale='YlOrRd',
        aspect="auto"
    )

   
    fig.update_traces(
        hovertemplate="<br>Wallet Row: %{y}<br>" +
                      "Wallet Column: %{x}<br>" +
                      "Log Amount: %{z:.2f}<extra></extra>"
    )

    
    fig.add_annotation(
        text="Rows and Columns represent wallets, sorted by token holdings.",
        xref="paper", yref="paper",
        x=0.5, y=-0.1,
        showarrow=False,
        font=dict(size=12)
    )

    fig.add_annotation(
        text="Hover over a cell to see wallet information (row, column, and amount).",
        xref="paper", yref="paper",
        x=0.5, y=-0.15,
        showarrow=False,
        font=dict(size=12)
    )

   
    fig.update_layout(
        title=f'Token Distribution Heatmap for ASA {ASSET_ID} (Mainnet)',
        xaxis_title="Wallet Column Index",
        yaxis_title="Wallet Row Index",
        coloraxis_colorbar=dict(
            title="Log10 Token Amount"
        ),
        margin=dict(l=40, r=40, t=80, b=100)
    )

    fig.show()


def show_bubble_chart():
    
    fig = px.scatter(
        top_wallets, 
        x='wallet_index', 
        y='amount', 
        size='amount',  
        color='amount',  
        hover_name='wallet_index',  
        size_max=100,  
        color_continuous_scale='Viridis',  
        labels={'amount': 'Token Amount', 'wallet_index': 'Wallet Index'},
        title=f'Whale vs Small Wallets for ASA {ASSET_ID}'
    )

    
    fig.update_traces(
        hovertemplate="<br>Wallet Index: %{x}<br>" +
                      "Token Amount: %{y:.2f}<br>" +
                      "<extra></extra>"
    )

   
    fig.update_layout(
        xaxis_title="Wallet Index (Sorted by Amount)",
        yaxis_title="Token Amount",
        coloraxis_colorbar=dict(
            title="Token Amount"
        ),
        margin=dict(l=40, r=40, t=80, b=100)
    )

    
    fig.show()


def show_treemap():
    fig = px.treemap(
        top_wallets, 
        path=['wallet_index'],  
        values='amount',  
        color='amount',  
        color_continuous_scale='YlGnBu',  
        title=f'Token Distribution Treemap for ASA {ASSET_ID}'
    )

    
    fig.update_traces(
        hovertemplate="<br>Wallet Index: %{label}<br>" +
                      "Token Amount: %{value:.2f}<br>" +
                      "<extra></extra>"
    )

    
    fig.update_layout(
        margin=dict(l=40, r=40, t=80, b=100)
    )

   
    fig.show()

# Simple menu for user input
def display_menu():
    print("Choose a visualization to display:")
    print("1. Heatmap")
    print("2. Bubble Chart")
    print("3. Treemap")
    
    choice = input("Enter the number of your choice (1/2/3): ")

    if choice == '1':
        show_heatmap()
    elif choice == '2':
        show_bubble_chart()
    elif choice == '3':
        show_treemap()
    else:
        print("Invalid choice. Please try again.")
        display_menu()


display_menu()
