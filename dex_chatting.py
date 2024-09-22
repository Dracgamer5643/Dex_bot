import webbrowser
import google.generativeai as genai
from bing_image_downloader import downloader

def gem(prompt):
    genai.configure(api_key="AIzaSyCk03OuBh1W_-IKvMfWD54UByiXAmYexYw")
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    output = response.text
    return output

def dex_chat(prompt):
    sites = [["youtube","https://youtube.com"],["wikipedia","https://wikipedia.com"],["google","https://google.com"],["Email","https://mail.google.com/mail/u/0/#inbox"],["Instagram","https://www.instagram.com/not_aditya533/"]]

    for site in sites:
        if f"open {site[0]}".lower() in prompt.lower() or f"start {site[0]}".lower() in prompt.lower():
            output = f"Opening {site[0]} Sir..."
            webbrowser.open(site[1])
            return output
    
    if f"provide images".lower() in prompt.lower():
        search_query = prompt
        downloader.download(search_query, limit=3, output_dir='bing_images', adult_filter_off=True, force_replace=False, timeout=60)
        output = "Yes the images are as follows..."
        return output

    return gem(prompt)