1. **`basic/creating_a_window_1.py`**

```python
import sys
from PySide6.QtWidgets import QApplication, QWidget

app = QApplication(sys.argv)
window = QWidget()
window.show()

app.exec()
```

1. **`basic/creating_a_window_3.py`**

```python
import sys
from PySide6.QtWidgets import QApplication, QMainWindow

app = QApplication(sys.argv)
window = QMainWindow()
window.show()

app.exec()
```

1. **`basic/creating_a_window_4.py`**

```python
from __future__ import annotations

import sys
from typing import Self

from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QApplication,
    QMainWindow,
    QPushButton,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(
        self: Self,
        parent: QWidget | None = None,
    ) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")
        button = QPushButton("Press Me!")

        self.setCentralWidget(button)


app = QApplication(sys.argv)
window = MainWindow()
window.show()

app.exec()
```

1. **`basic/creating_a_window_end.py`**

```python
from __future__ import annotations

import sys
from typing import Self

from PySide6.QtCore import QSize
from PySide6.QtWidgets import (
    QApplication,
    QMainWindow,
    QPushButton,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(
        self: Self,
        parent: QWidget | None = None,
    ) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")
        button = QPushButton("Press Me!")

        self.setFixedSize(QSize(400, 300))
        self.setCentralWidget(button)


app = QApplication(sys.argv)
window = MainWindow()
window.show()

app.exec()
```