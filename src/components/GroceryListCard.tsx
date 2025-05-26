import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ShoppingCart, Check, Calendar } from '@expo/vector-icons/Feather';
import { format, parseISO } from 'date-fns';
import { GroceryList } from '../types';

interface GroceryListCardProps {
  list: GroceryList;
  onPress: () => void;
}

export default function GroceryListCard({ list, onPress }: GroceryListCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {list.name}
          </Text>
          {list.is_completed ? (
            <View style={styles.completedBadge}>
              <Check size={12} color="#065F46" />
              <Text style={styles.completedText}>Completed</Text>
            </View>
          ) : (
            <View style={styles.activeBadge}>
              <ShoppingCart size={12} color="#1E40AF" />
              <Text style={styles.activeText}>Active</Text>
            </View>
          )}
        </View>

        <View style={styles.dateContainer}>
          <Calendar size={14} color="#6B7280" />
          <Text style={styles.dateText}>
            Week of {format(parseISO(list.week_of), 'MMM d, yyyy')}
          </Text>
        </View>

        {list.is_completed && list.total_spent && (
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total: </Text>
            <Text style={styles.totalAmount}>
              €{list.total_spent.toFixed(2)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Created {format(parseISO(list.created_at), 'MMM d, yyyy')}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 12,
    color: '#065F46',
    marginLeft: 4,
    fontWeight: '500',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeText: {
    fontSize: 12,
    color: '#1E40AF',
    marginLeft: 4,
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  totalContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
  footer: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
  },
});