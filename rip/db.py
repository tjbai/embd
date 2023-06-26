import sqlite3


class DB:
    def __init__(self, db_file):
        self.db_file = db_file
        self.conn = sqlite3.connect(self.db_file)
        self.cursor = self.conn.cursor()

    def __enter__(self):
        return self

    def __exit__(self, *_):
        self.conn.commit()
        self.conn.close()

    def execute(self, sql, params=()):
        self.cursor.execute(sql, params)
        return self.cursor.fetchall()

    def reset(self):
        self.execute(
            """
        DELETE FROM Courses
        """
        )
