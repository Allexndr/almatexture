import React, { Component } from 'react';
import { Table, Spinner, Alert, Form, Button } from 'react-bootstrap';
import axios from 'axios';

interface DataItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  createdAt: string;
}

interface DataTableProps {
  endpoint: string;
  title: string;
}

interface DataTableState {
  items: DataItem[];
  loading: boolean;
  error: string | null;
  sortField: keyof DataItem | null;
  sortDirection: 'asc' | 'desc';
  searchTerm: string;
}

class DataTable extends Component<DataTableProps, DataTableState> {
  private abortController: AbortController | null = null;
  
  constructor(props: DataTableProps) {
    super(props);
    
    this.state = {
      items: [],
      loading: true,
      error: null,
      sortField: null,
      sortDirection: 'asc',
      searchTerm: ''
    };
    
    // Привязываем обработчики событий
    this.fetchData = this.fetchData.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleClearSearch = this.handleClearSearch.bind(this);
  }
  
  // Метод жизненного цикла - монтирование компонента
  componentDidMount() {
    console.log('DataTable: компонент смонтирован');
    this.fetchData();
    
    // Добавляем прослушиватель события изменения размера окна
    window.addEventListener('resize', this.handleResize);
  }
  
  // Метод жизненного цикла - обновление компонента
  componentDidUpdate(prevProps: DataTableProps) {
    console.log('DataTable: компонент обновлен');
    
    // Если изменился эндпоинт, перезагружаем данные
    if (prevProps.endpoint !== this.props.endpoint) {
      this.setState({ loading: true, error: null });
      this.fetchData();
    }
  }
  
  // Метод жизненного цикла - размонтирование компонента
  componentWillUnmount() {
    console.log('DataTable: компонент размонтирован');
    
    // Отменяем запрос, если он в процессе
    if (this.abortController) {
      this.abortController.abort();
    }
    
    // Удаляем прослушиватель события
    window.removeEventListener('resize', this.handleResize);
  }
  
  // Обработчик изменения размера окна
  handleResize = () => {
    console.log('Размер окна изменен:', window.innerWidth, 'x', window.innerHeight);
  };
  
  // Получение данных с сервера
  async fetchData() {
    // Отменяем предыдущий запрос, если он в процессе
    if (this.abortController) {
      this.abortController.abort();
    }
    
    // Создаем новый контроллер для отмены запроса
    this.abortController = new AbortController();
    
    try {
      const response = await axios.get(this.props.endpoint, {
        signal: this.abortController.signal
      });
      
      this.setState({
        items: response.data,
        loading: false,
        error: null
      });
      
      console.log('Данные загружены:', response.data.length, 'элементов');
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Запрос отменен');
        return;
      }
      
      this.setState({
        loading: false,
        error: 'Ошибка при загрузке данных. Пожалуйста, попробуйте позже.'
      });
      
      console.error('Ошибка загрузки данных:', error);
    }
  }
  
  // Обработчик сортировки
  handleSort(field: keyof DataItem) {
    this.setState(prevState => {
      // Если поле то же самое, меняем направление сортировки
      const sortDirection = 
        prevState.sortField === field && prevState.sortDirection === 'asc' ? 'desc' : 'asc';
      
      // Сортируем элементы
      const items = [...prevState.items].sort((a, b) => {
        if (a[field] < b[field]) return sortDirection === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
      
      return {
        items,
        sortField: field,
        sortDirection
      };
    });
  }
  
  // Обработчик поиска
  handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ searchTerm: event.target.value });
  }
  
  // Очистка поиска
  handleClearSearch() {
    this.setState({ searchTerm: '' });
  }
  
  // Форматирование даты
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  
  render() {
    const { title } = this.props;
    const { items, loading, error, sortField, sortDirection, searchTerm } = this.state;
    
    // Фильтрация элементов по поисковому запросу
    const filteredItems = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
      <div className="data-table-container mb-4">
        <h2 className="mb-3">{title}</h2>
        
        {/* Поиск */}
        <div className="mb-3 d-flex">
          <Form.Control
            type="text"
            placeholder="Поиск по названию или категории"
            value={searchTerm}
            onChange={this.handleSearch}
            className="me-2"
          />
          <Button 
            variant="outline-secondary" 
            onClick={this.handleClearSearch}
            disabled={!searchTerm}
          >
            Очистить
          </Button>
        </div>
        
        {/* Индикатор загрузки */}
        {loading && (
          <div className="text-center my-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </Spinner>
          </div>
        )}
        
        {/* Сообщение об ошибке */}
        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}
        
        {/* Таблица данных */}
        {!loading && !error && (
          <>
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th 
                      className="sortable-header"
                      onClick={() => this.handleSort('id')}
                    >
                      ID
                      {sortField === 'id' && (
                        <span className="ms-1">
                          {sortDirection === 'asc' ? '▲' : '▼'}
                        </span>
                      )}
                    </th>
                    <th 
                      className="sortable-header"
                      onClick={() => this.handleSort('name')}
                    >
                      Название
                      {sortField === 'name' && (
                        <span className="ms-1">
                          {sortDirection === 'asc' ? '▲' : '▼'}
                        </span>
                      )}
                    </th>
                    <th 
                      className="sortable-header"
                      onClick={() => this.handleSort('category')}
                    >
                      Категория
                      {sortField === 'category' && (
                        <span className="ms-1">
                          {sortDirection === 'asc' ? '▲' : '▼'}
                        </span>
                      )}
                    </th>
                    <th 
                      className="sortable-header"
                      onClick={() => this.handleSort('price')}
                    >
                      Цена
                      {sortField === 'price' && (
                        <span className="ms-1">
                          {sortDirection === 'asc' ? '▲' : '▼'}
                        </span>
                      )}
                    </th>
                    <th 
                      className="sortable-header"
                      onClick={() => this.handleSort('stock')}
                    >
                      Наличие
                      {sortField === 'stock' && (
                        <span className="ms-1">
                          {sortDirection === 'asc' ? '▲' : '▼'}
                        </span>
                      )}
                    </th>
                    <th 
                      className="sortable-header"
                      onClick={() => this.handleSort('createdAt')}
                    >
                      Дата
                      {sortField === 'createdAt' && (
                        <span className="ms-1">
                          {sortDirection === 'asc' ? '▲' : '▼'}
                        </span>
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.category}</td>
                        <td>{item.price.toLocaleString()} ₸</td>
                        <td>{item.stock}</td>
                        <td>{this.formatDate(item.createdAt)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center">
                        {searchTerm 
                          ? 'Ничего не найдено. Измените параметры поиска.' 
                          : 'Нет данных.'}
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-end fw-bold">Всего элементов:</td>
                    <td colSpan={3}>{filteredItems.length}</td>
                  </tr>
                </tfoot>
              </Table>
            </div>
            
            <p className="text-muted small">
              {searchTerm 
                ? `Показано ${filteredItems.length} из ${items.length} элементов` 
                : `Всего элементов: ${items.length}`}
            </p>
          </>
        )}
      </div>
    );
  }
}

export default DataTable; 