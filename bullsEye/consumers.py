from channels.generic.websocket import WebsocketConsumer
import websocket
import json
from datetime import datetime
import tkinter as tk
from tkinter import simpledialog
import threading

class YourConsumer(WebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.root = None
        self.ws = None
        self.ws_thread = None
    
    def on_message(self, ws, message):
        data = json.loads(message)

        chart = (data['stream'].split('@')[0]).upper()  # Extracting trading pair from the 'stream' field
        candle = data['data']['k']
        timestamp = float(candle['t'])
        open_price = float(candle['o'])
        high_price = float(candle['h'])
        low_price = float(candle['l'])
        close_price = float(candle['c'])
        volume = float(candle['v'])
        
        formatted_data =  [chart, timestamp, open_price, high_price, low_price, close_price, volume]
        print(formatted_data)
        self.send(text_data=json.dumps(formatted_data))
    
    def on_close(self, ws):
        print("### connection closed ###")

    def connect(self):
        self.accept()
        self.trading_pair = 'btcusdt'  # Initial trading pair
        self.interval = '1m'  # Define your interval
        # Create the WebSocket URL with initial trading pair
        socket = f'wss://stream.binance.com:9443/stream?streams={self.trading_pair}@kline_{self.interval}'
        
        # Connect to WebSocket
        self.ws = websocket.WebSocketApp(socket, on_message=self.on_message, on_close=self.on_close)
        self.ws_thread = threading.Thread(target=self.ws.run_forever)
        self.ws_thread.daemon = True
        self.ws_thread.start()
        
        # Start the Tkinter window in a separate thread
        tkinter_thread = threading.Thread(target=self.run_tkinter)
        tkinter_thread.daemon = True
        tkinter_thread.start()

    def disconnect(self, close_code):
        self.ws.close()

    def subscribe_to_pair(self, pair):
        # Modify the trading pair
        self.trading_pair = pair
        # Modify the WebSocket URL to include the new trading pair
        new_socket = f'wss://stream.binance.com:9443/stream?streams={pair}@kline_{self.interval}'
        # Reconnect to WebSocket with the new URL
        self.ws.close()  # Close the current WebSocket connection
        self.ws = websocket.WebSocketApp(new_socket, on_message=self.on_message, on_close=self.on_close)
        self.ws_thread = threading.Thread(target=self.ws.run_forever)
        self.ws_thread.daemon = True
        self.ws_thread.start()

    def get_user_input(self):
        self.root = tk.Tk()
        self.root.withdraw()
        user_input = simpledialog.askstring("Input", "Enter a trading pair (e.g., btcusdt):")
        self.root.destroy()
        return user_input

    def run_tkinter(self):
        while True:
            user_input = self.get_user_input()
            if user_input:
                self.subscribe_to_pair(user_input)
