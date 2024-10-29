/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Plot from 'react-plotly.js'

const indexerUrl = 'https://mainnet-idx.algonode.cloud'

interface TokenBalance {
  address: string
  amount: string
}

const Heatmap: React.FC = () => {
  const [topWallets, setTopWallets] = useState<TokenBalance[]>([])
  const [assetId, setAssetId] = useState<number>(1691271561)
  const [inputAssetId, setInputAssetId] = useState<string>('1691271561')

  const fetchTokenBalances = async (assetId: number): Promise<TokenBalance[]> => {
    let balances: TokenBalance[] = []
    let nextToken = ''

    while (true) {
      try {
        const url = `${indexerUrl}/v2/assets/${assetId}/balances`
        const params = nextToken ? { next: nextToken } : {}
        const response = await axios.get(url, { params })
        const data = response.data

        balances = [...balances, ...data.balances]
        nextToken = data['next-token']
        if (!nextToken) break
      } catch (error) {
        console.error('An error occurred:', error)
        break
      }
    }

    return balances
  }

  useEffect(() => {
    const getBalances = async () => {
      const balances = await fetchTokenBalances(assetId)
      setTopWallets(balances)
    }

    getBalances()
  }, [assetId])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedAssetId = parseInt(inputAssetId, 10)
    if (!isNaN(parsedAssetId)) {
      setAssetId(parsedAssetId)
    }
  }

  const showHeatmap = () => {
    const N = 50
    const sortedWallets = topWallets
      .map((wallet) => ({ ...wallet, amount: parseFloat(wallet.amount) }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, N)

    const normalizedAmounts = sortedWallets.map((wallet) => Math.log10(wallet.amount + 1))
    const rows = 5
    const cols = 10

    const heatmapData = Array.from({ length: rows }, (_, rowIndex) =>
      normalizedAmounts.slice(rowIndex * cols, (rowIndex + 1) * cols)
    )
    return (
      <div className="mb-10">
        <Plot
          data={[{
            z: heatmapData,
            type: 'heatmap',
            colorscale: 'YlOrRd',
            colorbar: {
              title: 'Token Amount',
              titlefont: { color: '#ffffff' },
              titlefont: { color: '#ffffff' },
            },
          }]}
          layout={{
            title: `Token Distribution Heatmap for ASA ${assetId} (Mainnet)`,
            xaxis: { 
              title: 'Wallet Column Index', 
              titlefont: { color: '#ffffff' }, 
              tickfont: { color: '#ffffff' } 
            },
            yaxis: { 
              title: 'Wallet Row Index', 
              titlefont: { color: '#ffffff' }, 
              tickfont: { color: '#ffffff' } 
            },
            margin: { l: 40, r: 40, t: 80, b: 100 },
            width: 1100,
            height: 680,
            paper_bgcolor: '#001324',
            plot_bgcolor: '#001324',
            font: { color: '#ffffff' },
          }}
        />
      </div>
    )
  }

  const showBubbleChart = () => {
    const N = 50
    const sortedWallets = topWallets
      .map((wallet) => ({ ...wallet, amount: parseFloat(wallet.amount) }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, N)

    const maxAmount = Math.max(...sortedWallets.map((wallet) => wallet.amount))
    const bubbleData = sortedWallets.map((wallet, index) => ({
      walletIndex: (index + 1).toString(),
      amount: wallet.amount / maxAmount * 100,
    }))

    return (
      <div className="mb-10">
        <Plot
          data={[{
            x: bubbleData.map((_, index) => index + 1),
            y: bubbleData.map((data) => data.amount),
            text: bubbleData.map(
              (wallet) => `Wallet Index: ${wallet.walletIndex}<br>Token Amount: ${wallet.amount.toFixed(2)}`
            ),
            mode: 'markers',
            marker: {
              size: bubbleData.map((data) => data.amount / 2),
              color: bubbleData.map((data) => data.amount),
              colorscale: 'Viridis',
              showscale: true,
            },
          }]}
          layout={{
            title: `Whale Asset vs Small Wallets for ASA ${assetId}`,
            xaxis: { 
              title: 'Wallet Index (Sorted by Amount)', 
              titlefont: { color: '#ffffff' }, 
              tickfont: { color: '#ffffff' } 
            },
            yaxis: { 
              title: 'Token Amount (Normalized)', 
              titlefont: { color: '#ffffff' }, 
              tickfont: { color: '#ffffff' } 
            },
            margin: { l: 40, r: 40, t: 80, b: 100 },
            coloraxis: {
              colorbar: {
                title: 'Token Amount',
                titlefont: { color: '#ffffff' },
              },
            },
            width: 1100,
            height: 680,
            paper_bgcolor: '#001324', 
            plot_bgcolor: '#001f3b',
            titlefont: { color: '#ffffff' }, 
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col p-5 max-h-screen overflow-y-auto">
      <form onSubmit={handleSearchSubmit} className="flex items-center mb-5">
        <input
          type="text"
          value={inputAssetId}
          onChange={(e) => setInputAssetId(e.target.value)}
          placeholder="Enter Asset ID"
          className="p-2 text-lg border border-gray-300 rounded-md mr-2 w-52"
        />
        <button type="submit" className="px-4 py-2 text-lg text-white bg-blue-600 rounded-md hover:bg-blue-700 transition">Search</button>
      </form>
      {showHeatmap()}
      {showBubbleChart()}
    </div>
  )
}

export default Heatmap