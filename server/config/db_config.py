import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

DB_HOST = os.getenv('DB_HOST', '127.0.0.1')
DB_PORT = os.getenv('DB_PORT', '3306')
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_NAME = os.getenv('DB_NAME', 'eventhub_db')

# Business Rule Configurations
COMMISSION_RATE = float(os.getenv('COMMISSION_RATE', '0.10'))
ADVANCE_PAYMENT_RATE = float(os.getenv('ADVANCE_PAYMENT_RATE', '0.20'))
PLATFORM_CANCELLATION_FEE = float(os.getenv('PLATFORM_CANCELLATION_FEE', '2000.00'))

Base = declarative_base()

def get_engine():
    """
    Creates and returns SQLAlchemy engine.
    Attempts MySQL first; falls back smoothly to SQLite if MySQL is unavailable.
    """
    if DB_PASSWORD:
        mysql_url = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"
    else:
        mysql_url = f"mysql+pymysql://{DB_USER}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"
    
    try:
        engine = create_engine(mysql_url, pool_recycle=3600, pool_pre_ping=True)
        # Test connection
        with engine.connect() as conn:
            pass
        print(f"[Database] Connected successfully to MySQL ({DB_HOST}:{DB_PORT}/{DB_NAME})")
        return engine
    except Exception as e:
        sqlite_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'eventhub.sqlite3')
        sqlite_url = f"sqlite:///{sqlite_path}"
        print(f"[Database] MySQL connection notice: {e}")
        print(f"[Database] Falling back seamlessly to local SQLite DB ({sqlite_path}) for instant hackathon evaluation")
        return create_engine(sqlite_url, connect_args={"check_same_thread": False})

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
