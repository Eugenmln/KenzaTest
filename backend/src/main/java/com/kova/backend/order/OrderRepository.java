package com.kova.backend.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    @Query("select distinct o from Order o left join fetch o.items where o.user.id = :userId order by o.createdAt desc")
    List<Order> findAllByUserId(@Param("userId") UUID userId);

    @Query("select distinct o from Order o left join fetch o.items order by o.createdAt desc")
    List<Order> findAllWithItems();

    @Query("select distinct o from Order o left join fetch o.items where o.id = :id")
    Optional<Order> findWithItemsById(@Param("id") UUID id);
}
